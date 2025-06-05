const db = require("../models");
const Reservation = db.Reservation;
const Boat = db.Boat;
const Trip = db.Trip;
const Taxi = db.Taxi;
const Group = db.Group;
const Person = db.Person;
const ReservationTrip = db.ReservationTrip;

const getAll = async () => {
  return await Reservation.findAll({
    include: [
      {
        model: Group,
        include: [
          {
            model: Person,
            through: { attributes: [] },
          },
          {
            model: Person,
            as: "leader",
          },
        ],
      },
      {
        model: Boat,
      },
      {
        model: Trip,
        through: { attributes: ["typeOfTrip"] },
      },
    ],
  });
};

const getById = async (id) => {
  return await Reservation.findByPk(id, {
    include: [
      {
        model: Group,
        include: [
          {
            model: Person,
            through: { attributes: [] },
          },
          {
            model: Person,
            as: "leader",
          },
        ],
      },
      {
        model: Boat,
      },
      {
        model: Trip,
        through: { attributes: [
          "typeOfTrip",
          "peopleOnTrip",
          "boatsOnTrip"
        ] },
      },
    ],
  });
};

const create = async (data) => {
  const transaction = await db.sequelize.transaction();
  try {
    const arrivalCustom = data?.arrivalSchedule?.startsWith("Custom");
    const departureCustom = data?.departureSchedule?.startsWith("Custom");

    // Backend validation logic
    if (!data.arrivalDay || !data.departureDay) {
      throw new Error("Please select both arrival and departure dates.");
    }

    if (!data.arrivalSchedule || !data.departureSchedule) {
      throw new Error("Please select both arrival and departure schedules.");
    }

    if (arrivalCustom && !data.arrivalTime) {
      throw new Error("Please enter arrival time for custom schedule.");
    }

    if (departureCustom && !data.departureTime) {
      throw new Error("Please enter departure time for custom schedule.");
    }

    const arrivalTimeStr = resolveScheduleTime(data.arrivalSchedule, data.arrivalTime);
    const departureTimeStr = resolveScheduleTime(data.departureSchedule, data.departureTime);

    if (!arrivalTimeStr || !departureTimeStr) {
      throw new Error("Both arrival and departure times must be defined.");
    }

    const arrivalDateTime = new Date(`${data.arrivalDay}T${arrivalTimeStr}`);
    const departureDateTime = new Date(`${data.departureDay}T${departureTimeStr}`);

    if (arrivalDateTime >= departureDateTime) {
      throw new Error("Departure must be after arrival.");
    }

    if (data.numberOfPeople < 1 || !data.people?.[0]?.name) {
      throw new Error("Please enter a valid group size and leader name.");
    }

    if (data.numberOfPeople < data.people?.length) {
      throw new Error("There are too many people with data for the number of people stated.");
    }

    for (let person of data.people) {
      if (!person.name) {
        throw new Error("Each person must have a name.");
      }
    }

    for (let boat of data.boats) {
      if (!boat.type || boat.numberOf <= 0) {
        throw new Error("Each boat group must have a valid type and count.");
      }
    }

    // Proceed with reservation creation if all validations pass
    const arrivalDay = data.arrivalDay;
    const departureDay = data.departureDay;
    const arrivalSchedule = data.arrivalSchedule;
    const departureSchedule = data.departureSchedule;
    const arrivalTime = data.arrivalTime;
    const departureTime = data.departureTime;
    const arrivalFromPlace = data.arrivalFromPlace;
    const arrivalToPlace = data.arrivalToPlace;
    const departureFromPlace = data.departureFromPlace;
    const departureToPlace = data.departureToPlace;
    const numberOfPeople = data.numberOfPeople;
    const notes = data.notes;
    const people = data.people;
    const boats = data.boats;

    // Create people for reservation
    const createdPeople = await Promise.all(people.map((personMap) => Person.create({ name: personMap.name, allergies: personMap.allergies }, { transaction: transaction })));
    const leaderId = createdPeople[0].id;

    // Create group of people for reservation
    const group = await Group.create({ numberOfPeople, GroupLeader: leaderId, notes }, { transaction: transaction });
    await group.setPeople(createdPeople, { transaction: transaction });

    // Select taxi (get smallest taxi with enough space)
    const taxis = await Taxi.findAll();
    if (taxis?.length < 1) {
      throw new Error("No taxis found");
    }

    const totalBoats = boats.reduce((sum, boat) => sum + Number(boat.numberOf || 0), 0);
    const selectedTaxi = selectTaxi(taxis, numberOfPeople, totalBoats);

    // Find or create trips for reservation
    console.log(arrivalTimeStr);
    console.log(data.arrivalSchedule);
    console.log(data.arrivalTime);
    console.log(departureTimeStr);
    const arrivalData = {
      day: arrivalDay,
      schedule: arrivalSchedule,
      time: arrivalTimeStr,
      numberOfPeople: numberOfPeople,
      totalBoats: totalBoats,
      taxiId: selectedTaxi.id,
      fromPlace: arrivalCustom ? arrivalFromPlace : "Secret Beach",
      toPlace: arrivalCustom ? arrivalToPlace : "Lodge",
    };
    const departureData = {
      day: departureDay,
      schedule: departureSchedule,
      time: departureTimeStr,
      totalBoats: totalBoats,
      taxiId: selectedTaxi.id,
      fromPlace: departureCustom ? departureFromPlace : "Lodge",
      toPlace: departureCustom ? departureToPlace : "Secret Beach",
    };

    const arrivalTrip = await findOrCreateTrip(arrivalData, transaction);
    const departureTrip = await findOrCreateTrip(departureData, transaction);

    // Create the reservation and link all data
    const reservation = await Reservation.create({ GroupId: group.id }, { transaction: transaction });
    await reservation.setTrips([arrivalTrip.id, departureTrip.id], { transaction: transaction });

    // Create boats and link to reservation
    await Promise.all(
      boats.map((boat) =>
        Boat.create(
          {
            type: boat.type,
            numberOf: boat.numberOf,
            isRented: boat.rented,
            ReservationId: reservation.id,
          },
          { transaction: transaction }
        )
      )
    );

    // If no errors, and all data is created, save new reservation
    await transaction.commit();
    return { id: reservation.id };
  } catch (err) {
    console.error("Error during reservation creation:", err); // Log the error
    await transaction.rollback();
    throw err; // Re-throw to propagate the error
  }
};

function resolveScheduleTime(schedule, customTime) {
  const scheduleToTime = {
    "Lodge to Secret AM": "09:15",
    "Secret to Lodge AM": "10:15",
    "Lodge to Secret PM": "15:15",
    "Secret to Lodge PM": "16:00",
  };

  if (schedule.startsWith("Custom") || schedule.startsWith("Paddle")) {
    return customTime || null;
  }

  return scheduleToTime[schedule] || null;
}

function selectTaxi(taxis, numberOfPeople, totalBoats) {
  // return the smallest taxi with enough space, or the largest taxi if not enough
  const valid = taxis.filter((taxi) => taxi.spaceForKayaks >= totalBoats && taxi.spaceForPeople >= numberOfPeople);
  if (valid.length > 0) {
    return valid.reduce((min, taxi) => (taxi.spaceForKayaks < min.spaceForKayaks ? taxi : min), valid[0]);
  }
  return taxis.sort((a, b) => b.spaceForKayaks - a.spaceForKayaks)[0]; // Fallback
}

async function findOrCreateTrip({ day, schedule, time, numberOfPeople, totalBoats, taxiId, fromPlace, toPlace }, transaction) {
  const where = { day, timeFrame: schedule };
  if (schedule.startsWith("Custom")) {
    where.timeStart = time;
    where.fromPlace = fromPlace;
    where.toPlace = toPlace;
  }

  const { Op, fn, col, where: whereClause, cast } = require("sequelize");

  let trip = await Trip.findOne({
    where: {
      timeFrame: schedule,
      [Op.and]: [
        whereClause(fn("DATE", col("day")), day), // This strips time and compares date only
      ],
      ...(schedule.startsWith("Custom") && { timeStart: time }),
    },
    include: [
      {
        model: Reservation,
        include: [{ model: Group }, { model: Boat }],
      },
      { model: Taxi },
    ],
    transaction,
  });

  if (trip) {
    // Trip exists, check Taxi capacity
    const existingPeople = trip.Reservations.reduce((sum, r) => sum + (r.Group?.numberOfPeople || 0), 0);
    const existingBoats = trip.Reservations.reduce((sum, r) => sum + r.Boats.reduce((bSum, b) => bSum + (b.numberOf || 0), 0), 0);

    const totalPeople = existingPeople + numberOfPeople;
    const totalKayaks = existingBoats + totalBoats;

    const taxi = trip.Taxi;

    if (taxi.spaceForPeople < totalPeople || taxi.spaceForKayaks < totalKayaks) {
      // Find the best fitting taxi for the new amount of people if it doesnt fit
      const taxis = await Taxi.findAll(); // Fetch all available taxis
      const bestTaxi = selectTaxi(taxis, totalPeople, totalKayaks);

      // Change the TaxiId
      trip.TaxiId = bestTaxi.id;

      // Save the trip so the used taxi is changed
      await trip.save({ transaction });
    }

    return trip; // Return trip with the best fitting taxi
  }

  // No trip for time and schedule, so create one
  trip = await Trip.create(
    {
      day,
      timeFrame: schedule,
      timeStart: time,
      TaxiId: taxiId,
      fromPlace: fromPlace,
      toPlace: toPlace,
    },
    { transaction }
  );

  return trip;
}

const update = async (id, data) => {
  const transaction = await db.sequelize.transaction();
  try {
    const arrivalTrips = data?.trips?.arrival;
    const departureTrips = data?.trips?.departure;

    if (!arrivalTrips || !departureTrips) {
      throw new Error("A reservation needs arrival and departure trips.");
    }

    const arrivalDay = arrivalTrips[0]?.day?.split("T")[0];
    const departureDay = departureTrips[0].day?.split("T")[0];
    const arrivalFromPlace = arrivalTrips[0].fromPlace;
    const arrivalToPlace = arrivalTrips[0].toPlace;
    const departureFromPlace = departureTrips[0].fromPlace;
    const departureToPlace = departureTrips[0].toPlace;

    // Validate data
    if (!arrivalDay || !departureDay) {
      throw new Error("Please select both arrival and departure dates.");
    }

    if (data.numberOfPeople < 1) {
      throw new Error("Please enter a valid group size.");
    }

    if (!data.people?.[0]?.name) {
      throw new Error("Please enter a leader name.");
    }

    if (data.numberOfPeople < data.people?.length) {
      throw new Error("There are too many people with data for the number of people stated.");
    }

    for (let person of data.people) {
      if (!person.name) {
        throw new Error("Each person must have a name.");
      }
    }

    for (let boat of data.boats) {
      if (!boat.type || boat.numberOf <= 0) {
        throw new Error("Each boat group must have a valid type and count.");
      }
    }

    // Fetch existing reservation
    const reservation = await Reservation.findByPk(id, { include: [Group, Boat, Trip], transaction });
    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    // Update group of people for reservation
    const updatedGroup = await Group.findByPk(reservation.GroupId, { transaction });

    // Update or create people
    const updatedPeople = await Promise.all(
      data.people.map(async (personMap) => {
        let person;

        if (personMap.id) {
          // Find existing person
          person = await Person.findByPk(personMap.id, { transaction });
          if (!person) {
            throw new Error(`Person with id ${personMap.id} not found`);
          }

          // Update the person
          await person.update(
            {
              name: personMap.name,
              allergies: personMap.allergies,
            },
            { transaction }
          );
        } else {
          // Create new person
          person = await Person.create(
            {
              name: personMap.name,
              allergies: personMap.allergies,
            },
            { transaction }
          );
        }

        return person;
      })
    );

    // Link all people to the group
    await updatedGroup.setPeople(
      updatedPeople.map((p) => p.id),
      { transaction }
    );

    // Update the group's numberOfPeople
    await updatedGroup.update({ numberOfPeople: data.numberOfPeople, notes: data.notes }, { transaction });

    // Update or find trips for reservation
    const updatedArrivalTrips = (
      await Promise.all(
        arrivalTrips.map(async (trip) => {
          const arrivalSchedule = trip.timeFrame;
          const arrivalPaddle = arrivalSchedule.startsWith("Paddle");
          const arrivalCustom = arrivalSchedule.startsWith("Custom");
          const arrivalTime = trip.timeStart;
          const arrivalTaxiId = trip.TaxiId;
          const arrivalTimeStr = resolveScheduleTime(arrivalSchedule, arrivalTime);

          if (!arrivalSchedule) {
            throw new Error("Please select all arrival schedules.");
          }

          if (arrivalCustom && !arrivalTime) {
            throw new Error("Please enter arrival time for custom schedules.");
          }

          if (!arrivalTimeStr) {
            throw new Error("All arrival times and shedules must be defined.");
          }

          if (!arrivalPaddle && !arrivalTaxiId) {
            throw new Error("Plese select a taxi to use for the arrival trip.");
          }

          const arrivalData = {
            day: arrivalDay,
            timeFrame: arrivalSchedule,
            timeStart: arrivalTimeStr,
            TaxiId: arrivalPaddle ? null : arrivalTaxiId,
            fromPlace: arrivalCustom ? arrivalFromPlace : "Secret Beach",
            toPlace: arrivalCustom ? arrivalToPlace : "Lodge",
          };

          let tripInstance;
          if (trip.id) {
            let existingTrip = await Trip.findByPk(trip.id, { transaction });
            tripInstance = await existingTrip.update(arrivalData, {
              transaction,
              fields: Object.keys(arrivalData),
            });
          } else {
            tripInstance = await Trip.create(arrivalData, { transaction });
          }

          return {
            instance: tripInstance,
            peopleOnTrip: trip.peopleOnTrip || 0,
            boatsOnTrip: trip.boatsOnTrip || 0,
          };
        })
      )
    ).sort((a, b) => {
      return new Date(`${arrivalDay}T${b.timeStart}`) - new Date(`${arrivalDay}T${a.timeStart}`);
    });

    const updatedDepartureTrips = (
      await Promise.all(
        departureTrips.map(async (trip) => {
          const departureSchedule = trip.timeFrame;
          const departurePaddle = departureSchedule.startsWith("Paddle");
          const departureCustom = departureSchedule.startsWith("Custom");
          const departureTime = trip.timeStart;
          const departureTaxiId = trip.TaxiId;
          const departureTimeStr = resolveScheduleTime(departureSchedule, departureTime);

          const departureData = {
            day: departureDay,
            timeFrame: departureSchedule,
            timeStart: departureTimeStr,
            TaxiId: departurePaddle ? null : departureTaxiId,
            fromPlace: departureCustom ? departureFromPlace : "Lodge",
            toPlace: departureCustom ? departureToPlace : "Secret Beach",
          };

          let tripInstance;
          if (trip.id) {
            let existingTrip = await Trip.findByPk(trip.id, { transaction });
            tripInstance = await existingTrip.update(departureData, {
              transaction,
              fields: Object.keys(departureData),
            });
          } else {
            tripInstance = await Trip.create(departureData, { transaction });
          }

          return {
            instance: tripInstance,
            peopleOnTrip: trip.peopleOnTrip || 0,
            boatsOnTrip: trip.boatsOnTrip || 0,
          };
        })
      )
    ).sort((a, b) => {
      return new Date(`${arrivalDay}T${a.timeStart}`) - new Date(`${arrivalDay}T${b.timeStart}`);
    });

    const latestArrivalDateTime = new Date(`${arrivalDay}T${updatedArrivalTrips[0]?.timeStart}`);
    const earliestDepartureDateTime = new Date(`${departureDay}T${updatedDepartureTrips[0]?.timeStart}`);
    if (latestArrivalDateTime >= earliestDepartureDateTime) {
      throw new Error("Earliest departure must be after the latest arrival.");
    }

    let totalArrivalPeople = updatedArrivalTrips.reduce((sum, trip) => sum + (trip.peopleOnTrip || 0), 0);
    let totalDeparturePeople = updatedDepartureTrips.reduce((sum, trip) => sum + (trip.peopleOnTrip || 0), 0);
    let totalArrivalBoats = updatedArrivalTrips.reduce((sum, trip) => sum + (trip.boatsOnTrip || 0), 0);
    let totalDepartureBoats = updatedDepartureTrips.reduce((sum, trip) => sum + (trip.boatsOnTrip || 0), 0);
    const totalReservationBoats = data.boats.reduce((sum, boats) => {
      if (boats.isRented) {
        return sum;
      } else {
        return sum + boats.numberOf;
      }
    }, 0);

    if (arrivalTrips.length == 1) {
      totalArrivalPeople = data.numberOfPeople;
      totalArrivalBoats = totalReservationBoats;
    }

    if (departureTrips.length == 1) {
      totalDeparturePeople = data.numberOfPeople;
      totalDepartureBoats = totalReservationBoats;
    }

    if (totalArrivalPeople !== data.numberOfPeople) {
      if (totalArrivalPeople > data.numberOfPeople) {
        throw new Error("There are more people in the arrival trips than there are in the reservation");
      } else {
        throw new Error("There are less people in the arrival trips than there are in the reservation");
      }
    }

    if (totalDeparturePeople !== data.numberOfPeople) {
      if (totalDeparturePeople > data.numberOfPeople) {
        throw new Error("There are more people in the departure trips than there are in the reservation");
      } else {
        throw new Error("There are less people in the departure trips than there are in the reservation");
      }
    }

    if (totalArrivalBoats !== totalReservationBoats) {
      if (totalArrivalBoats > totalReservationBoats) {
        throw new Error("There are more personal boats in the arrival trips than there are in the reservation");
      } else {
        throw new Error("There are less personal boats in the arrival trips than there are in the reservation");
      }
    }

    if (totalDepartureBoats !== totalReservationBoats) {
      if (totalDepartureBoats > totalReservationBoats) {
        throw new Error("There are more personal boats in the departure trips than there are in the reservation");
      } else {
        throw new Error("There are less personal boats in the departure trips than there are in the reservation");
      }
    }

    // Update reservation's trips
    const allTrips = [...updatedArrivalTrips, ...updatedDepartureTrips].map((trip) => trip.instance);
    await reservation.setTrips(allTrips, { transaction });

    //set through attributes
    await Promise.all(
      updatedArrivalTrips.map(async (trip) => {
        if (arrivalTrips.length == 1) {
          trip.peopleOnTrip = data.numberOfPeople;
          trip.boatsOnTrip = totalReservationBoats;
        }
        if (trip.peopleOnTrip < 0) {
          throw new Error("Cannot have less than 0 people in the arrival trip.");
        }
        if (trip.boatsOnTrip < 0) {
          throw new Error("Cannot have less than 0 boats in the arrival trip.");
        }
        if (trip.boatsOnTrip < 1 && trip.peopleOnTrip < 1) {
          throw new Error("The arrival trip must have either 1 boat or one person.");
        }

        return ReservationTrip.update(
          {
            typeOfTrip: "Arrival",
            peopleOnTrip: trip.peopleOnTrip || 0,
            boatsOnTrip: trip.boatsOnTrip || 0,
          },
          {
            where: {
              reservationId: id,
              tripId: trip.instance.id,
            },
            transaction,
          }
        );
      })
    );

    await Promise.all(
      updatedDepartureTrips.map(async (trip) => {
        if (departureTrips.length == 1) {
          trip.peopleOnTrip = data.numberOfPeople;
          trip.boatsOnTrip = totalReservationBoats;
        }
        if (trip.peopleOnTrip < 0) {
          throw new Error("Cannot have less than 0 people in the departure trip.");
        }
        if (trip.boatsOnTrip < 0) {
          throw new Error("Cannot have less than 0 boats in the departure trip.");
        }
        if (trip.boatsOnTrip < 1 && trip.peopleOnTrip < 1) {
          throw new Error("The departure trip must have either 1 boat or one person.");
        }

        return ReservationTrip.update(
          {
            typeOfTrip: "Departure",
            peopleOnTrip: trip.peopleOnTrip || 0,
            boatsOnTrip: trip.boatsOnTrip || 0,
          },
          {
            where: {
              reservationId: id,
              tripId: trip.instance.id,
            },
            transaction,
          }
        );
      })
    );

    // Update boats linked to reservation
    await Promise.all(
      data.boats.map(async (boatData) => {
        if (boatData.id) {
          await Boat.update(
            {
              type: boatData.type,
              numberOf: boatData.numberOf,
              isRented: boatData.isRented,
            },
            { where: { id: boatData.id }, transaction }
          );
        } else {
          await Boat.create(
            {
              type: boatData.type,
              numberOf: boatData.numberOf,
              isRented: boatData.isRented,
              ReservationId: reservation.id,
            },
            { transaction }
          );
        }
      })
    );

    // throw new Error("Unfinished backend"); // for debugging and error catching or testing

    // Commit transaction
    await transaction.commit();

    return { id: reservation.id };
  } catch (err) {
    console.error("Error during reservation update:", err);
    await transaction.rollback();
    throw err; // Re-throw to propagate the error
  }
};

const deleteOne = async (id) => {
  const transaction = await db.sequelize.transaction();
  try {
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Group,
          include: [Person],
        },
        {
          model: Boat,
        },
        {
          model: Trip,
        },
      ],
      transaction,
    });

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    // Collect Trip IDs before unlinking
    const tripIds = reservation.Trips?.map((t) => t.id) || [];

    // Remove associated boats
    await Boat.destroy({ where: { ReservationId: reservation.id }, transaction });

    // Remove trip associations
    await reservation.setTrips([], { transaction });

    // Delete people
    if (reservation.Group?.People?.length) {
      const personIds = reservation.Group.People.map((p) => p.id);
      await Person.destroy({ where: { id: personIds }, transaction });
    }

    // Delete group
    if (reservation.GroupId) {
      await Group.destroy({ where: { id: reservation.GroupId }, transaction });
    }

    // Delete reservation
    await Reservation.destroy({ where: { id }, transaction });

    // Clean up orphaned trips (if no other reservations)
    for (const tripId of tripIds) {
      const trip = await Trip.findByPk(tripId, {
        include: Reservation,
        transaction,
      });

      if (trip && trip.Reservations.length === 0) {
        await trip.destroy({ transaction });
      }
    }

    await transaction.commit();
    return { success: true, message: `Reservation ${id} deleted.` };
  } catch (err) {
    console.error("Error during reservation deletion:", err);
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne,
};

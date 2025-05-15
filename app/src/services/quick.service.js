const db = require('../models');
const Reservation = db.Reservation;
const Boat = db.Boat;
const Trip = db.Trip;
const Taxi = db.Taxi;
const Group = db.Group;
const Person = db.Person;

const getById = async (id) => {
    return await Reservation.findByPk(id, {
        include: [
            {
                model: Group,
                include: [
                    {
                        model: Person,
                        through: { attributes: [] }
                    },
                    {
                        model: Person,
                        as: 'leader'
                    }
                ]
            },
            {
                model: Boat,
            },
            {
                model: Trip,
                through: { attributes: [] }
            }
        ]
    });
};

const create = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Backend validation logic
        if (!data.arrivalDay || !data.departureDay) {
            throw new Error("Please select both arrival and departure dates.");
        }

        if (!data.arrivalSchedule || !data.departureSchedule) {
            throw new Error("Please select both arrival and departure schedules.");
        }

        if (data.arrivalSchedule.startsWith("Custom") && !data.arrivalTime) {
            throw new Error("Please enter arrival time for custom schedule.");
        }

        if (data.departureSchedule.startsWith("Custom") && !data.departureTime) {
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
        const { arrivalDay, departureDay, arrivalSchedule, departureSchedule, arrivalTime, departureTime, numberOfPeople, people, boats } = data;

        // Create people for reservation
        const createdPeople = await Promise.all(
            people.map(personMap => Person.create({ name: personMap.name, allergies: personMap.allergies }, { transaction: transaction }))
        );
        const leaderId = createdPeople[0].id;

        // Create group of people for reservation
        const group = await Group.create({ numberOfPeople, GroupLeader: leaderId }, { transaction: transaction });
        await group.setPeople(createdPeople, { transaction: transaction });

        // Select taxi (get smallest taxi with enough space)
        const taxis = await Taxi.findAll();
        const totalBoats = boats.reduce((sum, boat) => sum + Number(boat.numberOf || 0), 0);
        const selectedTaxi = selectTaxi(taxis, numberOfPeople, totalBoats);

        // Find or create trips for reservation
        const arrivalTrip = await findOrCreateTrip({ day: arrivalDay, schedule: arrivalSchedule, time: arrivalTime, numberOfPeople: numberOfPeople, totalBoats: totalBoats, taxiId: selectedTaxi.id }, transaction);
        const departureTrip = await findOrCreateTrip({ day: departureDay, schedule: departureSchedule, time: departureTime, numberOfPeople: numberOfPeople, totalBoats: totalBoats, taxiId: selectedTaxi.id }, transaction);

        // Create the reservation and link all data
        const reservation = await Reservation.create({ GroupId: group.id }, { transaction: transaction });
        await reservation.setTrips([arrivalTrip.id, departureTrip.id], { transaction: transaction });

        // Create boats and link to reservation
        await Promise.all(boats.map(boat =>
            Boat.create({
                type: boat.type,
                numberOf: boat.numberOf,
                isRented: boat.rented,
                ReservationId: reservation.id
            }, { transaction: transaction })
        ));

        // If no errors, and all data is created, save new reservation
        await transaction.commit();
        return { id: reservation.id };
    } catch (err) {
        console.error("Error during reservation creation:", err);  // Log the error
        await transaction.rollback();
        throw err;  // Re-throw to propagate the error
    }
};


function resolveScheduleTime(schedule, customTime) {
    const scheduleToTime = {
        "Lodge to Secret AM": "09:15",
        "Secret to Lodge AM": "10:15",
        "Lodge to Secret PM": "15:15",
        "Secret to Lodge PM": "16:00"
    };

    if (schedule.startsWith("Custom")) {
        return customTime || null;
    }

    return scheduleToTime[schedule] || null;
};

function selectTaxi(taxis, numberOfPeople, totalBoats) {
    // return the smallest taxi with enough space, or the largest taxi if not enough
    const valid = taxis.filter(taxi => taxi.spaceForKayaks >= totalBoats && taxi.spaceForPeople >= numberOfPeople);
    if (valid.length > 0) {
        return valid.reduce((min, taxi) => taxi.spaceForKayaks < min.spaceForKayaks ? taxi : min, valid[0]);
    }
    return taxis.sort((a, b) => b.spaceForKayaks - a.spaceForKayaks)[0]; // Fallback
}

async function findOrCreateTrip({ day, schedule, time, numberOfPeople, totalBoats, taxiId }, transaction) {
  const where = { day, timeFrame: schedule };
  if (schedule.startsWith("Custom")) {
    where.timeStart = time;
  }

  let trip = await Trip.findOne({
    where,
    include: [
      {
        model: Reservation,
        include: [
          { model: Group },
          { model: Boat }
        ]
      },
      { model: Taxi }
    ],
    transaction
  });

  if (trip) {
    // Trip exists, check Taxi capacity
    const existingPeople = trip.Reservations.reduce((sum, r) =>
      sum + (r.Group?.numberOfPeople || 0), 0
    );
    const existingBoats = trip.Reservations.reduce((sum, r) =>
      sum + r.Boats.reduce((bSum, b) => bSum + (b.numberOf || 0), 0), 0
    );

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
  trip = await Trip.create({
    day,
    timeFrame: schedule,
    timeStart: schedule.startsWith("Custom") ? time : undefined,
    TaxiId: taxiId
  }, { transaction });

  return trip;
}

const update = async (id, data) => {
    throw ("Not implemented yet");
};

module.exports = {
    getById,
    create,
    update,
};

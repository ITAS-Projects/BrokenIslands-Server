const db = require("../models");
const Boat = db.Boat;
const Group = db.Group;
const Trip = db.Trip;
const Taxi = db.Taxi;
const Reservation = db.Reservation;
const Person = db.Person;

const getAll = async () => {
    return await Trip.findAll({
        include: [
            {
                model: Taxi,
            },
            {
                model: Group,
                through: { attributes: [] },
                include: [
                    {
                        model: Boat,
                    },
                    {
                        model: Person,
                        as: "leader",
                    },
                ],
            },
            {
                model: Reservation,
                through: { attributes: [] },
                include: [
                    {
                        model: Group,
                        include: [
                            {
                                model: Person,
                                as: "leader",
                            },
                        ],
                    },
                    {
                        model: Boat,
                    },
                ],
            },
            {
                model: Group,
                as: "People",
                include: [
                    {
                        model: Boat,
                    },
                ],
            },
        ],
    });
};

const getById = async (id) => {
    return await Trip.findByPk(id, {
        include: [
            {
                model: Taxi,
            },
            {
                model: Group,
                through: { attributes: [] },
                include: [
                    {
                        model: Boat,
                    },
                    {
                        model: Person,
                        as: "leader",
                    },
                ],
            },
            {
                model: Reservation,
                through: { attributes: [] },
                include: [
                    {
                        model: Group,
                        include: [
                            {
                                model: Person,
                                as: "leader",
                            },
                        ],
                    },
                    {
                        model: Boat,
                    },
                ],
            },
            {
                model: Group,
                as: "People",
                include: [
                    {
                        model: Boat,
                    },
                ],
            },
        ],
    });
};

const create = async (data) => {
    console.log(data);
    const transaction = await db.sequelize.transaction();
    try {
        const trip = data.trip;
        const day = trip.day;
        const schedule = trip.timeFrame;
        const fromPlace = trip.fromPlace;
        const toPlace = trip.toPlace;
        const timeStr = trip.timeStart;
        const numberOfPeople = data.numberOfPeople;
        const notes = trip.reason;
        const people = data.people;
        const boats = data.boats;

        // Backend validation logic
        if (!day) {
            throw new Error("Please select a date.");
        }

        if (!schedule) {
            throw new Error("Please select a schedule.");
        }

        if (!timeStr) {
            throw new Error("Please enter the time the trip starts.");
        }

        const arrivalDateTime = new Date(`${day}T${timeStr}`);

        if (numberOfPeople < 1 || !people?.[0]?.name) {
            throw new Error("Please enter a valid group size and leader name.");
        }

        if (numberOfPeople < people?.length) {
            throw new Error("There are too many people with data for the number of people stated.");
        }

        for (let person of people) {
            if (!person.name) {
                throw new Error("Each person must have a name.");
            }
        }

        for (let boat of boats) {
            if (!boat.type || boat.numberOf <= 0) {
                throw new Error("Each boat group must have a valid type and count.");
            }
        }

        if (!(fromPlace || "") || !(toPlace || "")) {
            throw new Error("Please add a place to and a place from for this trip.")
        }
        
        // Select taxi (get smallest taxi with enough space)
        const taxis = await Taxi.findAll();
        if (taxis?.length < 1) {
            throw new Error("No taxis found");
        }
        
        const totalBoats = boats.reduce((sum, boat) => sum + Number(boat.numberOf || 0), 0);
        const selectedTaxi = selectTaxi(taxis, numberOfPeople, totalBoats);
        
        // Create trip
        const createdTrip = await Trip.create(
            {
                day: day,
                timeFrame: schedule,
                timeStart: timeStr,
                TaxiId: selectedTaxi.id,
                fromPlace: fromPlace,
                toPlace: toPlace,
            },
            { transaction }
        );

        // Create people for group
        const createdPeople = await Promise.all(people.map((personMap) => Person.create({ name: personMap.name }, { transaction: transaction })));
        const leaderId = createdPeople[0].id;

        // Create group of people for reservation
        const group = await Group.create({ seperatePeople: true, numberOfPeople, GroupLeader: leaderId, notes: notes, AdditionalPeople: createdTrip.id }, { transaction: transaction });
        await group.setPeople(createdPeople, { transaction: transaction });

        // Create boats and link to reservation
        await Promise.all(
            boats.map((boat) =>
                Boat.create(
                    {
                        type: boat.type,
                        numberOf: boat.numberOf,
                        isRented: boat.rented,
                        GroupId: group.id,
                    },
                    { transaction: transaction }
                )
            )
        );

        // If no errors, and all data is created, save new reservation
        await transaction.commit();
        return { id: group.id };
    } catch (err) {
        console.error("Error during reservation creation:", err); // Log the error
        await transaction.rollback();
        throw err; // Re-throw to propagate the error
    }
};

function selectTaxi(taxis, numberOfPeople, totalBoats) {
    // return the smallest taxi with enough space, or the largest taxi if not enough
    const valid = taxis.filter((taxi) => taxi.spaceForKayaks >= totalBoats && taxi.spaceForPeople >= numberOfPeople);
    if (valid.length > 0) {
        return valid.reduce((min, taxi) => (taxi.spaceForKayaks < min.spaceForKayaks ? taxi : min), valid[0]);
    }
    return taxis.sort((a, b) => b.spaceForKayaks - a.spaceForKayaks)[0]; // Fallback
}

const update = async (id, data) => {
    throw new Error("Not implemented");
    return null;
};

const deleteOne = async (id) => {
    throw new Error("Not implemented");
    return null;
    //   const trip = await Trip.findByPk(id);
    //   return await trip.destroy();
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteOne,
};

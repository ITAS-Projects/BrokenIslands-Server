const db = require('../models');
const Boat = db.Boat;
const Schedule = db.Schedule;
const Person = db.Person;
const Trip = db.Trip;
const Taxi = db.Taxi;

const getAll = async () => {
  return await Trip.findAll({
    include: [
      {
        model: Person,
        through: { attributes: [] }
      },
      {
        model: Boat,
        through: { attributes: [] } // assuming many-to-many
      },
      {
        model: Taxi
      },
      {
        model: Schedule
      }
    ]
  });
};

const getById = async (id) => {
  return await Trip.findByPk(id, {
    include: [
      {
        model: Person,
        through: { attributes: [] } // assuming many-to-many
      },
      {
        model: Boat,
        through: { attributes: [] } // assuming many-to-many
      },
      {
        model: Taxi
      },
      {
        model: Schedule
      }
    ]
  });
};


const create = async (data) => {
  const trip = await Trip.create(data);

  if (data.personIds && Array.isArray(data.personIds) && data.personIds.length > 0) {
    await trip.addPeople(data.personIds);
  }

  if (data.boatsIds && Array.isArray(data.boatsIds) && data.boatsIds.length > 0) {
    await trip.addBoats(data.boatsIds);
  }

  return trip;
};

const update = async (id, data) => {
  const trip = await Trip.findByPk(id);
  if (!trip) {
    throw new Error('Trip not found');
  }

  await trip.update(data);

  if (data.personIds && Array.isArray(data.personIds)) {
    await trip.setPeople(data.personIds); // Replaces associations
  }

  if (data.boatsIds && Array.isArray(data.boatsIds)) {
    await trip.setBoats(data.boatsIds);
  }

  return trip;
};


const deleteOne = async (id) => {
  const trip = await Trip.findByPk(id);
  return await trip.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

const db = require('../models');
const Person = db.Person;
const Schedule = db.Schedule;
const Trip = db.Trip;

const getAll = async () => {
  return await Person.findAll({
    include: [
      {
        model: Schedule,
        through: { attributes: [] } // This hides the join table data (PersonSchedule)
      },
      {
        model: Trip,
        through: { attributes: [] } // This hides the join table data (PersonTrip)
      },
    ]
  });
};

const getById = async (id) => {
  return await Person.findByPk(id, {
    include: [
      {
        model: Schedule,
        through: { attributes: [] } // This hides the join table data (PersonSchedule)
      },
      {
        model: Trip,
        through: { attributes: [] } // This hides the join table data (PersonTrip)
      },
    ]
  });
};

const create = async (data) => {
  const person = await Person.create(data);

  if (data.scheduleIds && Array.isArray(data.scheduleIds) && data.scheduleIds.length > 0) {
    await person.addSchedules(data.scheduleIds);
  }

  if (data.tripIds && Array.isArray(data.tripIds) && data.tripIds.length > 0) {
    await person.addTrips(data.tripIds);
  }

  return person;
};


const update = async (id, data) => {
  const person = await Person.findByPk(id);
  if (!person) {
    throw new Error('Person not found');
  }

  await person.update(data);

  if (data.scheduleIds && Array.isArray(data.scheduleIds)) {
    await person.setSchedules(data.scheduleIds);
  }

  if (data.tripIds && Array.isArray(data.tripIds)) {
    await person.setTrips(data.tripIds);
  }

  return person;
};


const deleteOne = async (id) => {
  const person = await Person.findByPk(id);
  return await person.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

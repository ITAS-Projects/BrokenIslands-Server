const db = require('../models');
const Person = db.Person;
const Schedule = db.Schedule;

const getAll = async () => {
  return await Person.findAll({
    include: {
      model: Schedule,
      through: { attributes: [] } // This hides the join table data (PersonSchedule)
    }
  });
};

const getById = async (id) => {
  return await Person.findByPk(id, {
    include: {
      model: Schedule,
      through: { attributes: [] } // This hides the join table data (PersonSchedule)
    }
  });
};

const create = async (data) => {
  const person = await Person.create(data);

  if (data.scheduleIds && Array.isArray(data.scheduleIds) && data.scheduleIds.length > 0) {
    await person.addSchedules(data.scheduleIds);
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

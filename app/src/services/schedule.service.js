const db = require('../models');
const Schedule = db.Schedule;
const Person = db.Person;

const getAll = async () => {
  return await Schedule.findAll({
    include: {
      model: Person,
      through: { attributes: [] }
    }
  });
};

const getById = async (id) => {
  return await Schedule.findByPk(id, {
    include: {
      model: Person,
      through: { attributes: [] }
    }
  });
};

const create = async (data) => {
  const schedule = await Schedule.create(data);

  if (data.personIds && Array.isArray(data.personIds) && data.personIds.length > 0) {
    await schedule.addPeople(data.personIds);
  }

  return schedule;
};

const update = async (id, data) => {
  const item = await Schedule.findByPk(id);
  if (!item) {
    throw new Error('Schedule not found');
  }

  await item.update(data);

  if (data.personIds && Array.isArray(data.personIds)) {
    await item.setPeople(data.personIds); // Replaces associations
  }

  return item;
};


const deleteOne = async (id) => {
  const item = await Schedule.findByPk(id);
  return await item.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

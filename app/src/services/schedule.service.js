const db = require('../models');
const Boat = db.Boat;
const Schedule = db.Schedule;
const Person = db.Person;

const getAll = async () => {
  return await Schedule.findAll({
    include: [
      {
        model: Person,
        through: { attributes: [] }
      },
      {
        model: Boat
      }
    ]
  });
};

const getById = async (id) => {
  return await Schedule.findByPk(id, {
    include: [
      {
        model: Person,
        through: { attributes: [] } // assuming many-to-many
      },
      {
        model: Boat
      }
    ]
  });
};


const create = async (data) => {
  if (data.costOverride === "") {
    data.costOverride = null; // or undefined if your ORM prefers it
  }

  const schedule = await Schedule.create(data);

  if (data.personIds && Array.isArray(data.personIds) && data.personIds.length > 0) {
    await schedule.addPeople(data.personIds);
  }

  if (data.boatsIds && Array.isArray(data.boatsIds) && data.boatsIds.length > 0) {
    await schedule.setBoats(data.boatsIds);
  }

  return schedule;
};

const update = async (id, data) => {

  if (data.costOverride === "") {
    data.costOverride = null; // or undefined if your ORM prefers it
  }

  const item = await Schedule.findByPk(id);
  if (!item) {
    throw new Error('Schedule not found');
  }

  await item.update(data);

  if (data.personIds && Array.isArray(data.personIds)) {
    await item.setPeople(data.personIds); // Replaces associations
  }

  if (data.boatsIds && Array.isArray(data.boatsIds)) {
    await item.setBoats(data.boatsIds);
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

const db = require('../models');
const Boat = db.Boat;
const Group = db.Group;
const Person = db.Person;
const Reservation = db.Reservation;
const Trip = db.Trip;

const getAll = async () => {
  return await Group.findAll({
    include: [
      {
        model: Person,
        through: { attributes: [] }
      },
      {
        model: Boat,
        through: { attributes: [] }
      },
      {
        model: Reservation,
      },
      {
        model: Trip,
        through: { attributes: [] }
      }
    ]
  });
};

const getById = async (id) => {
  return await Group.findByPk(id, {
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
        model: Reservation,
      },
      {
        model: Trip,
        through: { attributes: [] }
      },
      {
        model: Person,
        as: 'leader'
      }
    ]
  });
};

const create = async (data) => {
  const schedule = await Group.create(data);

  if (data.personIds && Array.isArray(data.personIds) && data.personIds.length > 0) {
    await schedule.addPeople(data.personIds);
  }

  if (data.boatsIds && Array.isArray(data.boatsIds) && data.boatsIds.length > 0) {
    await schedule.addBoats(data.boatsIds);
  }

  return schedule;
};

const update = async (id, data) => {
  const item = await Group.findByPk(id);
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
  const item = await Group.findByPk(id);
  return await item.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

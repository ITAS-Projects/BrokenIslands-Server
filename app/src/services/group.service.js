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
      },
      {
        model: Person,
        as: 'leader'
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
        model: Boat
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
  const group = await Group.create(data);

  if (data.personIds && Array.isArray(data.personIds) && data.personIds.length > 0) {
    await group.addPeople(data.personIds);
  }

  if (data.boatsIds && Array.isArray(data.boatsIds) && data.boatsIds.length > 0) {
    await group.addBoats(data.boatsIds);
  }

  return group;
};

const update = async (id, data) => {
  const group = await Group.findByPk(id);
  if (!group) {
    throw new Error('Schedule not found');
  }

  await group.update(data);

  if (data.personIds && Array.isArray(data.personIds)) {
    await group.setPeople(data.personIds); // Replaces associations
  }

  if (data.boatsIds && Array.isArray(data.boatsIds)) {
    await group.setBoats(data.boatsIds);
  }

  return group;
};


const deleteOne = async (id) => {
  const group = await Group.findByPk(id);
  return await group.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

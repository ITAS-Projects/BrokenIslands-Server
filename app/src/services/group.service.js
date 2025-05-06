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
  const { PersonIds, TripIds, ...groupData } = data;

  const group = await Group.create(groupData);

  if (PersonIds) {
    await group.setPeople(PersonIds); // 'People' = association alias for Person
  }

  if (TripIds) {
    await group.setTrips(TripIds);
  }

  return group;
};

const update = async (id, data) => {
  const { PersonIds, TripIds, ...groupData } = data;

  const group = await Group.findByPk(id);
  if (!group) {
    throw new Error('Group not found');
  }

  await group.update(groupData);

  if (PersonIds) {
    await group.setPeople(PersonIds);
  }

  if (TripIds) {
    await group.setTrips(TripIds);
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

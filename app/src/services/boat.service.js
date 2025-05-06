const db = require('../models');
const Boat = db.Boat;
const Reservation = db.Reservation;
const Group = db.Group;

const getAll = async () => {
  return await Boat.findAll({
    include: [
      {
        model: Reservation,
      },
      {
        model: Group,
      }
    ]
  });
};

const getById = async (id) => {
  return await Boat.findByPk(id, {
    include: [
      {
        model: Reservation,
      },
      {
        model: Group,
      }
    ]
  });
};

const create = async (data) => {
  const { ReservationIds, GroupIds, ...boatData } = data;

  const boat = await Boat.create(boatData);

  if (ReservationIds) {
    await boat.setReservations(ReservationIds);
  }

  if (GroupIds) {
    await boat.setGroups(GroupIds);
  }

  return boat;
};


const update = async (id, data) => {
  const { ReservationIds, GroupIds, ...boatData } = data;

  const boat = await Boat.findByPk(id);
  if (!boat) {
    throw new Error('Boat not found');
  }

  await boat.update(boatData);

  if (ReservationIds) {
    await boat.setReservations(ReservationIds);
  }

  if (GroupIds) {
    await boat.setGroups(GroupIds);
  }

  return boat;
};


const deleteOne = async (id) => {
  const item = await Boat.findByPk(id);
  return await item.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

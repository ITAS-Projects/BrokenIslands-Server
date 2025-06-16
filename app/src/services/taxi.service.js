const db = require('../models');
const Taxi = db.Taxi;
const Trip = db.Trip;
const Boat = db.Boat;
const Group = db.Group;
const Reservation = db.Reservation;

const getAll = async () => {
  return await Taxi.findAll({
    include: [
      {
        model: Trip,
        include: [
          {
            model: Group,
            include: [
              {
                model: Boat,
              }
            ]
          },
          {
            model: Reservation,
            through: { attributes: [] },
            include: [
              {
                model: Group,
              },
              {
                model: Boat,
              }
            ]
          }
        ]
      }
    ]
  });
};

const getById = async (id) => {
  return await Taxi.findByPk(id, {
    include: [
      {
        model: Trip,
        include: [
          {
            model: Group,
            include: [
              {
                model: Boat,
              }
            ]
          },
          {
            model: Reservation,
            through: { attributes: [] },
            include: [
              {
                model: Group,
              },
              {
                model: Boat,
              }
            ]
          }
        ]
      }
    ]
  });
};

const create = async (data) => {
  const { TripIds, ...taxiData } = data;

  const taxi = await Taxi.create(taxiData);

  if (TripIds) {
    await taxi.setTrips(TripIds);
  }

  return taxi;
};

const update = async (id, data) => {
  const { TripIds, ...taxiData } = data;

  const taxi = await Taxi.findByPk(id);
  if (!taxi) {
    throw new Error('Taxi not found');
  }

  await taxi.update(taxiData);

  if (TripIds) {
    await taxi.setTrips(TripIds);
  }

  return taxi;
};


const deleteOne = async (id) => {
  const item = await Taxi.findByPk(id);
  return await item.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

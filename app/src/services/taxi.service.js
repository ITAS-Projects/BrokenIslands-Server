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
            through: { attributes: [] },
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
            through: { attributes: [] },
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
  return await Taxi.create(data);
};

const update = async (id, data) => {
  const item = await Taxi.findByPk(id);
  return await item.update(data);
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

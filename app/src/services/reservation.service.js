const db = require('../models');
const Reservation = db.Reservation;
const Boat = db.Boat;
const Trip = db.Trip;
const Group = db.Group;
const Person = db.Person;
const Taxi = db.Taxi;

const getAll = async () => {
  return await Reservation.findAll({
    include: [
      {
        model: Group,
        include: [
          {
            model: Person,
            as: 'leader'
          }
        ]
      },
      {
        model: Boat,
      },
      {
        model: Trip,
        through: { attributes: [] }
      }
    ]
  });
};

const getById = async (id) => {
  return await Reservation.findByPk(id, {
    include: [
      {
        model: Group,
        include: [
          {
            model: Person,
            as: 'leader'
          }
        ]
      },
      {
        model: Boat,
      },
      {
        model: Trip,
        through: { attributes: [] }
      }
    ]
  });
};

const create = async (data) => {
  return await Reservation.create(data);
};

const update = async (id, data) => {
  const item = await Reservation.findByPk(id);
  return await item.update(data);
};

const deleteOne = async (id) => {
  const item = await Reservation.findByPk(id);
  return await item.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

const db = require('../models');
const Reservation = db.Reservation;

const getAll = async () => {
  return await Reservation.findAll();
};

const getById = async (id) => {
  return await Reservation.findByPk(id);
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

const db = require('../models');
const Taxi = db.Taxi;

const getAll = async () => {
  return await Taxi.findAll();
};

const getById = async (id) => {
  return await Taxi.findByPk(id);
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

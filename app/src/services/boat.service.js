const db = require('../models');
const Boat = db.Boat;

const getAll = async () => {
  return await Boat.findAll();
};

const getById = async (id) => {
  return await Boat.findByPk(id);
};

const create = async (data) => {
  return await Boat.create(data);
};

const update = async (id, data) => {
  const item = await Boat.findByPk(id);
  return await item.update(data);
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

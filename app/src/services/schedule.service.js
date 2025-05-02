const db = require('../models');
const Schedule = db.Schedule;

const getAll = async () => {
  return await Schedule.findAll();
};

const getById = async (id) => {
  return await Schedule.findByPk(id);
};

const create = async (data) => {
  return await Schedule.create(data);
};

const update = async (id, data) => {
  const item = await Schedule.findByPk(id);
  return await item.update(data);
};

const deleteOne = async (id) => {
  const item = await Schedule.findByPk(id);
  return await item.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

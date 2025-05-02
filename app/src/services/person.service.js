const db = require('../models');
const Person = db.Person;

const getAll = async () => {
  return await Person.findAll();
};

const getById = async (id) => {
  return await Person.findByPk(id);
};

const create = async (data) => {
  return await Person.create(data);
};

const update = async (id, data) => {
  const item = await Person.findByPk(id);
  return await item.update(data);
};

const deleteOne = async (id) => {
  const item = await Person.findByPk(id);
  return await item.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

const PersonService = require('../services/person.service');

exports.getAll = async (req, res) => {
  const data = await PersonService.getAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await PersonService.getById(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  const data = await PersonService.create(req.body);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await PersonService.update(req.params.id, req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await PersonService.delete(req.params.id);
  res.json({ message: 'Person deleted' });
};

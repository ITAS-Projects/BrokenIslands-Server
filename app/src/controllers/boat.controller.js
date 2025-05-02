const BoatService = require('../services/boat.service');

exports.getAll = async (req, res) => {
  const data = await BoatService.getAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await BoatService.getById(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  const data = await BoatService.create(req.body);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await BoatService.update(req.params.id, req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await BoatService.delete(req.params.id);
  res.json({ message: 'Boat deleted' });
};

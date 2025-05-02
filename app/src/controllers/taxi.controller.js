const TaxiService = require('../services/taxi.service');

exports.getAll = async (req, res) => {
  const data = await TaxiService.getAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await TaxiService.getById(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  const data = await TaxiService.create(req.body);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await TaxiService.update(req.params.id, req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await TaxiService.delete(req.params.id);
  res.json({ message: 'Taxi deleted' });
};

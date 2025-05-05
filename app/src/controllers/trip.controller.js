const TripService = require('../services/trip.service');

exports.getAll = async (req, res) => {
  const data = await TripService.getAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await TripService.getById(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  const data = await TripService.create(req.body);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await TripService.update(req.params.id, req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await TripService.delete(req.params.id);
  res.json({ message: 'TripService deleted' });
};

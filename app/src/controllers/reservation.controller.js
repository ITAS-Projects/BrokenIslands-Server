const ReservationService = require('../services/reservation.service');

exports.getAll = async (req, res) => {
  const data = await ReservationService.getAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await ReservationService.getById(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  const data = await ReservationService.create(req.body);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await ReservationService.update(req.params.id, req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await ReservationService.delete(req.params.id);
  res.json({ message: 'Reservation deleted' });
};

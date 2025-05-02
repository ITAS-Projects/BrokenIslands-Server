const ScheduleService = require('../services/schedule.service');

exports.getAll = async (req, res) => {
  const data = await ScheduleService.getAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await ScheduleService.getById(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  const data = await ScheduleService.create(req.body);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await ScheduleService.update(req.params.id, req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await ScheduleService.delete(req.params.id);
  res.json({ message: 'Schedule deleted' });
};

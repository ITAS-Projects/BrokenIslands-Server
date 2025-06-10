const Trip2Service = require("../services/trip2.service");

exports.getAll = async (req, res) => {
  const data = await Trip2Service.getAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await Trip2Service.getById(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    const data = await Trip2Service.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create reservation" });
  }
};

exports.update = async (req, res) => {
  const data = await Trip2Service.update(req.params.id, req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await Trip2Service.delete(req.params.id);
  res.json({ message: "TripService deleted" });
};

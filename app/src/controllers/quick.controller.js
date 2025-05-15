const QuickService = require('../services/quick.service');

exports.getById = async (req, res) => {
  const data = await QuickService.getById(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    const data = await QuickService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create reservation' });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await QuickService.update(req.params.id, req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to edit reservation' });
  }
};
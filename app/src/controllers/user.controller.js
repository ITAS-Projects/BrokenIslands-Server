const UserService = require('../services/user.service');

const Descope = require('@descope/node-sdk');  // Correct import

// Initialize Descope SDK
const descope = Descope({
  projectId: process.env.DESCOPE_PROJECT_ID, 
  managementKey: process.env.DESCOPE_MANAGEMENT_KEY 
});

exports.getAll = async (req, res) => {
    try {
        const data = await UserService.getAll(descope);
        res.json(data);
    } catch (error) {
        res.status(500).send({
            message: 'Error fetching users',
            error: error.message || 'Unknown error',
        });
    }

};

exports.getById = async (req, res) => {
    const data = await UserService.getById(req.params.id);
    res.json(data);
};

exports.create = async (req, res) => {
    const data = await UserService.create(req.body);
    res.json(data);
};

exports.update = async (req, res) => {
    const data = await UserService.update(req.params.id, req.body);
    res.json(data);
};

exports.delete = async (req, res) => {
    const data = await UserService.delete(req.params.id);
    res.json({ message: 'UserService deleted' });
};

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
    try {
        const data = await UserService.getById(descope, req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).send({
            message: 'Error fetching user',
            error: error.message || 'Unknown error',
        });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await UserService.create(descope, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).send({
            message: 'Error creating user',
            error: error.message || 'Unknown error',
        });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await UserService.update(descope, req.params.id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).send({
            message: 'Error editing user',
            error: error.message || 'Unknown error',
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty IDs list' });
        }

        const results = await UserService.delete(descope, ids);
        res.json({ message: 'Users deleted', results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting users' });
    }
};

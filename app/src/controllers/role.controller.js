const RoleService = require('../services/role.service');

const Descope = require('@descope/node-sdk');  // Correct import

// Initialize Descope SDK
const descope = Descope({
  projectId: process.env.DESCOPE_PROJECT_ID, 
  managementKey: process.env.DESCOPE_MANAGEMENT_KEY 
});

exports.getAll = async (req, res) => {
    try {
        const data = await RoleService.getAll(descope);
        res.json(data);
    } catch (error) {
        res.status(500).send({
            message: 'Error fetching roles',
            error: error.message || 'Unknown error',
        });
    }

};
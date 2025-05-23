const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

// Define the root route ("/") to list users
router.get('/', roleController.getAll);

module.exports = router;

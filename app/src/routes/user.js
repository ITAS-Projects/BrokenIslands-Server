const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Define the root route ("/") to list users
router.get('/', userController.getAll);

module.exports = router;

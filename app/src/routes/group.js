const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller.js');
const { validateUserHasPermissions } = require('../middleware/auth');

router.get('/', groupController.getAll);
router.get('/:id', groupController.getById);
router.post('/', groupController.create);
router.put('/:id', groupController.update);
router.delete('/:id', groupController.delete);

module.exports = router;

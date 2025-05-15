const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');
const { validateUserHasPermissions } = require('../middleware/auth');

router.get('/', validateUserHasPermissions(['View Person']), personController.getAll);
router.get('/:id', validateUserHasPermissions(['View Person']), personController.getById);
router.post('/', personController.create);
router.put('/:id', personController.update);
router.delete('/:id', personController.delete);

module.exports = router;

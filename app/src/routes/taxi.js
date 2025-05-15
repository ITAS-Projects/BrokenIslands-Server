const express = require('express');
const router = express.Router();
const taxiController = require('../controllers/taxi.controller');
const { validateUserHasPermissions } = require('../middleware/auth');

router.get('/', validateUserHasPermissions(['View Taxi']), taxiController.getAll);
router.get('/:id', validateUserHasPermissions(['View Taxi']), taxiController.getById);
router.post('/', taxiController.create);
router.put('/:id', taxiController.update);
router.delete('/:id', taxiController.delete);

module.exports = router;

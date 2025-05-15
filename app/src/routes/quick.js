const express = require('express');
const router = express.Router();
const quickController = require('../controllers/quick.controller');
const { validateUserHasPermissions } = require('../middleware/auth');

router.get('/:id', validateUserHasPermissions(['View Reservation']), quickController.getById);
router.post('/', validateUserHasPermissions(['Edit Reservation']), quickController.create);
router.put('/:id', validateUserHasPermissions(['Edit Reservation']), quickController.update);

module.exports = router;

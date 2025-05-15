const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { validateUserHasPermissions } = require('../middleware/auth');

router.get('/', validateUserHasPermissions(['View Reservation']), reservationController.getAll);
router.get('/:id', validateUserHasPermissions(['View Reservation']), reservationController.getById);
router.post('/', validateUserHasPermissions(['Edit Reservation']), reservationController.create);
router.put('/:id', validateUserHasPermissions(['Edit Reservation']), reservationController.update);
router.delete('/:id', validateUserHasPermissions(['Edit Reservation']), reservationController.delete);

module.exports = router;

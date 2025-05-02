const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');

router.get('/', reservationController.getAll);
router.get('/:id', reservationController.getById);
router.post('/', reservationController.create);
router.put('/:id', reservationController.update);
router.delete('/:id', reservationController.delete);

module.exports = router;

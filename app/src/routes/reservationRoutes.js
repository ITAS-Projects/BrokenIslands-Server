// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Get all reservations
router.get('/', reservationController.getAllReservations);

// Get reservations by a specific person
router.get('/person/:id', reservationController.getReservationsByPerson);

// Create a new reservation
router.post('/', reservationController.createReservation);

module.exports = router;

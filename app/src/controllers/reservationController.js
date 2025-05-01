// controllers/reservationController.js
const Reservation = require('../models/reservation');
const reservationService = require('../services/reservationService');

const reservationController = {
  getAllReservations: async (req, res) => {
    try {
      const reservations = await Reservation.getAll();
      res.status(200).json(reservations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getReservationsByPerson: async (req, res) => {
    const personId = req.params.id;
    try {
      const reservations = await Reservation.getByPersonId(personId);
      res.status(200).json(reservations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createReservation: async (req, res) => {
    const { personId, reservationDate } = req.body;
    try {
      const result = await Reservation.create(personId, reservationDate);
      res.status(201).json({ message: "Reservation created", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = reservationController;

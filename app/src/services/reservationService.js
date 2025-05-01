// services/reservationService.js
const Reservation = require('../models/reservation');

const reservationService = {
  async createReservation(personId, reservationDate) {
    // Add additional logic here if needed (e.g., check availability)
    return await Reservation.create(personId, reservationDate);
  },

  // More reservation-specific logic, e.g., checking conflicts, etc.
};

module.exports = reservationService;

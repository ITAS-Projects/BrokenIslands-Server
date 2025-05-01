// models/reservation.js
const db = require('../config/db');

const Reservation = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM reservations;", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  getByPersonId: (personId) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM reservations WHERE person_id = ?";
      db.query(sql, [personId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  create: (personId, reservationDate) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO reservations (person_id, reservation_date) VALUES (?, ?)";
      db.query(sql, [personId, reservationDate], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  // More methods as needed (e.g., update, delete)
};

module.exports = Reservation;

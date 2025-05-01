const db = require('../config/db');

const People = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM people;", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM people WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]); // Expecting a single row
      });
    });
  },

  create: (name, email) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO people (name, email) VALUES (?, ?)";
      db.query(sql, [name, email], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  update: (id, name, email) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE people SET name = ?, email = ? WHERE id = ?";
      db.query(sql, [name, email, id], (err, result) => {
        if (err) return reject(err);
        resolve(result); // Optionally return affectedRows
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM people WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result); // Optionally return affectedRows
      });
    });
  }
};

module.exports = People;

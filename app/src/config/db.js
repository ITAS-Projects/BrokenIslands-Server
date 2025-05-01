// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');

    // Create 'people' table if not exists
    const createPeopleTable = `
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL
        );
    `;
    db.query(createPeopleTable, (err) => {
        if (err) console.error('Failed to create people table:', err.message);
        else console.log("'people' table is ready.");
    });

    // Create 'reservations' table if not exists
    const createReservationsTable = `
        CREATE TABLE IF NOT EXISTS reservations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            person_id INT,
            reservation_date DATE,
            FOREIGN KEY (person_id) REFERENCES people(id)
        );
    `;
    db.query(createReservationsTable, (err) => {
        if (err) console.error('Failed to create reservations table:', err.message);
        else console.log("'reservations' table is ready.");
    });
});

module.exports = db;

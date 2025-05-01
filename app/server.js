// server.js
// Import required modules
const express = require('express'); // Express framework for handling HTTP requests
const mysql = require('mysql2'); // MySQL2 client for Node.js
const cors = require('cors'); // For web security

// Create an instance of express
const app = express();
app.use(cors());

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.HOST,         // Database host
    user: process.env.USER,         // Database username
    password: process.env.PASSWORD, // Database password
    database: process.env.DATABASE, // Name of the database
    port: process.env.PORT          // Database port
});

// Define a route for the root URL '/'
app.get('/', (req, res) => {
    // Respond with a JSON message
    return res.json("From backend side");
});

// Define a route to fetch all items from the 'items' table
app.get('/items', (req, res) => {
    const sql = "select * from items"; // SQL query to select all items
    db.query(sql, (err, data) => { // Execute the SQL query
        if (err) return res.json(err); // If there's an error, return the error
        return res.json(data); // Otherwise, return the data as JSON
    })
});

// Start the server and listen on port 8081
app.listen(8081, () => {
    console.log("listening");
});
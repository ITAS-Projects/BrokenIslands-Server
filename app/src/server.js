// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const peopleRoutes = require('./routes/peopleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use(cors());
app.use(express.json());

// Routes
app.use('/people', peopleRoutes);
app.use('/reservations', reservationRoutes);

// Handle 404 (not found)
app.use((req, res) => {
  res.status(404).json({ error: `Invalid route: ${req.originalUrl}` });
});

// Start the server
app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});

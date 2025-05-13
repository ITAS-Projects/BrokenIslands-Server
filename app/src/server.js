require('dotenv').config({ path: '.database.env' });

const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/people', require('./routes/person'));
app.use('/api/reservations', require('./routes/reservation'));
app.use('/api/groups', require('./routes/group'));
app.use('/api/taxis', require('./routes/taxi'));
app.use('/api/boats', require('./routes/boat'));
app.use('/api/trips', require('./routes/trip'));

db.sequelize.sync().then(() => {
  app.listen(8081, () => console.log('Server is running on http://localhost:8081'));
});

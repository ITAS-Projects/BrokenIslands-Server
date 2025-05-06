const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');

app.use(cors());
app.use(express.json());

// Routes
app.use('/people', require('./routes/person'));
app.use('/reservations', require('./routes/reservation'));
app.use('/groups', require('./routes/group'));
app.use('/taxis', require('./routes/taxi'));
app.use('/boats', require('./routes/boat'));
app.use('/trips', require('./routes/trip'));

db.sequelize.sync().then(() => {
  app.listen(8081, () => console.log('Server is running on http://localhost:8081'));
});

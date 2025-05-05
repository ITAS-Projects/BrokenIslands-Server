const { Sequelize, DataTypes } = require('sequelize');
const db = {};

// Create a config object
const config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT || 3306, // Default port 3306 if PORT is not defined
  };

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql', // or 'postgres', 'sqlite', etc., depending on your DB
  port: config.port,
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Person = require('./person')(sequelize, DataTypes);
db.Reservation = require('./reservation')(sequelize, DataTypes);
db.Schedule = require('./schedule')(sequelize, DataTypes);
db.Taxi = require('./taxi')(sequelize, DataTypes);
db.Boat = require('./boat')(sequelize, DataTypes);
db.Trip = require('./trip')(sequelize, DataTypes);

Object.keys(db).forEach((model) => {
  if (db[model].associate) db[model].associate(db);
});

module.exports = db;

module.exports = (sequelize, DataTypes) => {
    const Trip = sequelize.define('Trip', {
      timeStart: DataTypes.TIME,          // time that the taxi arrives
      timeEnd: DataTypes.TIME,            // time that the taxi reaches the destination
      day: DataTypes.DATE,                // the day the trip is planned for (usually same as Schedule)
      fromPlace: DataTypes.STRING,        // the island, or position that the taxi starts at
      toPlace: DataTypes.STRING,          // the island or place the taxi ends at
      numberOfPeople: DataTypes.INTEGER,  // the amount of people that will be on this trip
      numberOfBoats: DataTypes.INTEGER    // the number of boats that will be on the trip
    });
  
    Trip.associate = (models) => {
      Trip.belongsTo(models.Taxi);        // the taxi that will be used
      Trip.belongsTo(models.Schedule);    // the schedule that has this trip in it
      Trip.belongsToMany(models.Boat, {
        through: 'BoatTrips',
        foreignKey: 'tripId',
        otherKey: 'boatId'
      });                                 // the boats that will be carried in this trip
      Trip.belongsToMany(models.Person, {
        through: 'PersonTrip',
        foreignKey: 'tripId',
        otherKey: 'personId'
      });                                 // the people on the trip that have names / data eg reserver, or allergies
    };
  
    return Trip;
  };
  
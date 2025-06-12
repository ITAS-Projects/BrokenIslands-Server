module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    timeStart: DataTypes.TIME,          // time that the taxi arrives
    timeEnd: DataTypes.TIME,            // time that the taxi reaches the destination
    day: DataTypes.DATE,                // the day the trip is planned for (usually same as Schedule)
    fromPlace: DataTypes.STRING,        // the island, or position that the taxi starts at
    toPlace: DataTypes.STRING,          // the island or place the taxi ends at
    timeFrame: DataTypes.STRING,        // the time frame the trip is set for (AM from lodge, AM to lodge, PM from lodge, PM custom, ect)
  });

  Trip.associate = (models) => {
    Trip.belongsTo(models.Taxi);        // the taxi that will be used
    Trip.belongsToMany(models.Reservation, {
      through: 'ReservationTrip',
      foreignKey: 'tripId',
      otherKey: 'reservationId'
    });                                 // the boats that will be carried in this trip
    Trip.belongsToMany(models.Group, {
      through: 'GroupTrip',
      foreignKey: 'tripId',
      otherKey: 'groupId'
    });                                 // unused value
    Trip.hasOne(models.Group, { foreignKey: 'AdditionalPeople', as: 'People' });
  };

  return Trip;
};

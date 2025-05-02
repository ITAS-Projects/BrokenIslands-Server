module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      timesCamping: DataTypes.INTEGER,
      timesInLodge: DataTypes.INTEGER
    });
  
    Reservation.associate = (models) => {
      // Reservation.belongsTo(models.Person, { as: 'ReservedBy', foreignKey: 'reserver' });
      // Reservation.hasMany(models.Boat, { as: 'boats' });
      // Reservation.hasMany(models.Person, { as: 'People' }); // all people in reservation
      Reservation.hasMany(models.Schedule, { as: 'ArrivalAndDepature' });
      // Reservation.hasOne(models.Schedule, { as: 'DepartureTime', foreignKey: 'departureScheduleId' });
    };
  
    return Reservation;
  };
  
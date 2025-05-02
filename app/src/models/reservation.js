module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      timesCamping: DataTypes.INTEGER,
      timesInLodge: DataTypes.INTEGER
    });
  
    Reservation.associate = (models) => {
      Reservation.belongsTo(models.Person, { as: 'ReservedBy', foreignKey: 'reserver' });
      Reservation.hasMany(models.Person, { as: 'People' }); // all people in reservation
      Reservation.hasOne(models.Schedule, { as: 'Arrival', foreignKey: 'ArrivalScheduleId' });
      Reservation.hasOne(models.Schedule, { as: 'Departure', foreignKey: 'departureScheduleId' });
    };
  
    return Reservation;
  };
  
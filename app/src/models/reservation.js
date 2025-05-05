module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      timesCamping: DataTypes.INTEGER,                                                                // the portion of the trip camping (unused)
      timesInLodge: DataTypes.INTEGER,                                                                // the portion of the trip in the Lodge (unused)
      numberOfPeople: DataTypes.INTEGER                                                               // the number of people the reservation is for
    });
  
    Reservation.associate = (models) => {
      Reservation.belongsTo(models.Person, { as: 'ReservedBy', foreignKey: 'reserver' });             // the person that reserved the 
      Reservation.hasMany(models.Person, { as: 'People' });                                           // all people in the reservation that have data (eg allergies and reserver)
      Reservation.hasOne(models.Schedule, { as: 'Arrival', foreignKey: 'ArrivalScheduleId' });        // the schedule to get the people to the lodge/camp
      Reservation.hasOne(models.Schedule, { as: 'Departure', foreignKey: 'departureScheduleId' });    // the schedule to get the people to 
    };
  
    return Reservation;
  };
  
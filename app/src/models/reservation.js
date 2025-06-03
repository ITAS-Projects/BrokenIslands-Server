module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      status: DataTypes.STRING // e.g., 'pending', 'confirmed', 'cancelled'
    });
  
    Reservation.associate = (models) => {
      Reservation.belongsTo(models.Group);    // the group that reserved
      Reservation.hasMany(models.Boat);                                     // The boats being transported by the arrival and departure times
      Reservation.belongsToMany(models.Trip, {
        through: 'ReservationTrip',
        foreignKey: 'reservationId',
        otherKey: 'tripId'
      });
    };
  
    return Reservation;
  };
  
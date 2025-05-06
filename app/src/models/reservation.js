module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
    });
  
    Reservation.associate = (models) => {
      Reservation.belongsTo(models.Group);    // the group that reserved
      Reservation.belongsToMany(models.Boat, {
        through: 'ReservationBoat',
        foreignKey: 'reservationId',
        otherKey: 'boatId'
      });                                     // The boats being transported by the arrival and departure times
    };
  
    return Reservation;
  };
  
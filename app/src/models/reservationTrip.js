module.exports = (sequelize, DataTypes) => {
    const ReservationTrip = sequelize.define('ReservationTrip', {
      typeOfTrip: DataTypes.STRING,
      peopleOnTrip : DataTypes.INTEGER,
      boatsOnTrip : DataTypes.INTEGER
    });
  
    ReservationTrip.associate = (models) => {
        // ReservationTrip.belongsTo(models.Reservation);  // already made using 'Through'
        // ReservationTrip.belongsTo(models.Trip);
    };
  
    return ReservationTrip;
  };
  
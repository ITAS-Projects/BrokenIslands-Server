module.exports = (sequelize, DataTypes) => {
    const Boat = sequelize.define('Boat', {
      type: DataTypes.STRING,           // canoe or kayak
      isRented: DataTypes.BOOLEAN,      // true or false (just for data / cannot end in the wrong place e.g. as the campers leave, the rented boat leaves with them (for much later))
      numberOf: DataTypes.INTEGER       // the number if this type of boat used
    });
  
    Boat.associate = (models) => {  
      Boat.belongsToMany(models.Schedule, {
        through: 'BoatSchedules',
        foreignKey: 'boatId',
        otherKey: 'scheduleId'
      });                               // Allow Schedule to make boats
      Boat.belongsToMany(models.Trip, {
        through: 'BoatTrips',
        foreignKey: 'boatId',
        otherKey: 'tripId'
      });                               // Allow Trip to use boats    
    };
  
    return Boat;
  };
  
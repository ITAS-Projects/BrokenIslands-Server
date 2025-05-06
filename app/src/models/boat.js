module.exports = (sequelize, DataTypes) => {
    const Boat = sequelize.define('Boat', {
      type: DataTypes.STRING,           // canoe or kayak
      isRented: DataTypes.BOOLEAN,      // true or false (just for data / cannot end in the wrong place e.g. as the campers leave, the rented boat leaves with them (for much later))
      numberOf: DataTypes.INTEGER       // the number if this type of boat used
    });
  
    Boat.associate = (models) => {  
      Boat.belongsToMany(models.Reservation, {
        through: 'ReservationBoat',
        foreignKey: 'boatId',
        otherKey: 'reservationId'
      }); 
      Boat.belongsToMany(models.Group, {
        through: 'GroupBoat',
        foreignKey: 'boatId',
        otherKey: 'groupId'
      });
      Boat.belongsToMany(models.Person, {
        through: 'PersonBoat',
        foreignKey: 'boatId',
        otherKey: 'personId'
      });
    };
  
    return Boat;
  };
  
module.exports = (sequelize, DataTypes) => {
    const Boat = sequelize.define('Boat', {
      type: DataTypes.STRING,           // canoe or kayak
      isRented: DataTypes.BOOLEAN,      // true or false (just for data / cannot end in the wrong place e.g. as the campers leave, the rented boat leaves with them (for much later))
      numberOf: DataTypes.INTEGER       // the number if this type of boat used
    });
  
    Boat.associate = (models) => {  
      Boat.belongsTo(models.Group);
      Boat.belongsTo(models.Reservation);
    };
  
    return Boat;
  };
  
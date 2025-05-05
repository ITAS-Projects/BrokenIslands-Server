module.exports = (sequelize, DataTypes) => {
    const Boat = sequelize.define('Boat', {
      type: DataTypes.STRING,           // canoe or kayak
      size: DataTypes.STRING,           // single, single XL, double, double XL
      isRented: DataTypes.BOOLEAN       // true or false (just for data / cannot end in the wrong place e.g. as the campers leave, the rented boat leaves with them)
    });
  
    Boat.associate = (models) => {  
      Boat.belongsTo(models.Schedule);  // Allow Schedule to make boats
      Boat.belongsTo(models.Trip);      // Allow Trip to use boats
    };
  
    return Boat;
  };
  
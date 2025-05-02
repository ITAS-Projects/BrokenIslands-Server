module.exports = (sequelize, DataTypes) => {
    const Boat = sequelize.define('Boat', {
      type: DataTypes.STRING,
      size: DataTypes.STRING,
      isPersonal: DataTypes.BOOLEAN,
      timeBookedStart: DataTypes.DATE,
      timeBookedEnd: DataTypes.DATE
    });
  
    Boat.associate = (models) => {
      Boat.belongsTo(models.Reservation, { as: 'FromGroup' });
    };
  
    return Boat;
  };
  
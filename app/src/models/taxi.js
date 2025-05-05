module.exports = (sequelize, DataTypes) => {
    const Taxi = sequelize.define('Taxi', {
      spaceForKayaks: DataTypes.INTEGER,          // the space for the boats on this taxi (currently just 12 and 8)
      running: DataTypes.BOOLEAN                  // if the taxi stopps running, or needs maintenence it needs to be disabled, so a trip cannot use it
    });
  
    Taxi.associate = (models) => {
      Taxi.hasMany(models.Trip, { as: 'trips' }); // the trips the taxi needs to take
    };
  
    return Taxi;
  };
  
module.exports = (sequelize, DataTypes) => {
    const Taxi = sequelize.define('Taxi', {
      spaceForKayaks: DataTypes.INTEGER,
      running: DataTypes.BOOLEAN
    });
  
    Taxi.associate = (models) => {
      Taxi.hasMany(models.Schedule, { as: 'schedules' });
    };
  
    return Taxi;
  };
  
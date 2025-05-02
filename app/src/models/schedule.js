module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
      timeStart: DataTypes.DATE,
      timeEnd: DataTypes.DATE,
      day: DataTypes.STRING,
      fromPlace: DataTypes.STRING,
      toPlace: DataTypes.STRING,
      costOverride: DataTypes.FLOAT,
      reason: DataTypes.STRING
    });
  
    Schedule.associate = (models) => {
      // Schedule.belongsTo(models.Taxi, { as: 'TaxiUsed' });
      Schedule.belongsToMany(models.Person, {
        through: 'PersonSchedule',
        foreignKey: 'scheduleId',
        otherKey: 'personId'
      });
      Schedule.belongsTo(models.Reservation);
    };
  
    return Schedule;
  };
  
module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
      timeStart: DataTypes.TIME,
      timeEnd: DataTypes.TIME,
      day: DataTypes.DATE,
      fromPlace: DataTypes.STRING,
      toPlace: DataTypes.STRING,
      costOverride: DataTypes.FLOAT,
      reason: DataTypes.STRING,
      numberOfPeople: DataTypes.INTEGER,
      numberOfBoats: DataTypes.INTEGER
    });
  
    Schedule.associate = (models) => {
      Schedule.belongsTo(models.Taxi);
      Schedule.belongsToMany(models.Person, {
        through: 'PersonSchedule',
        foreignKey: 'scheduleId',
        otherKey: 'personId'
      });
      Schedule.hasMany(models.Boat);

      // Schedule.belongsTo(models.Reservation);
    };
  
    return Schedule;
  };
  
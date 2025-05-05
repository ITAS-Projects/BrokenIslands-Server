module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
      timeStart: DataTypes.TIME,          // the time that the first boat for the first trip should arrive
      timeEnd: DataTypes.TIME,            // the time that the last boat for the last trip ends at the destination
      day: DataTypes.DATE,                // the day the schedule is planned for (use start day if different days)
      fromPlace: DataTypes.STRING,        // the place the people are being picked up from
      toPlace: DataTypes.STRING,          // the place the trip will bring the contents to
      reason: DataTypes.STRING,           // the reason for the trip (e.g a row back, a lumber move ect)
      numberOfPeople: DataTypes.INTEGER,  // the number of people that need to be transported
      numberOfBoats: DataTypes.INTEGER    // the number of boats that need to be transported
    });
  
    Schedule.associate = (models) => {
      Schedule.belongsToMany(models.Person, {
        through: 'PersonSchedule',
        foreignKey: 'scheduleId',
        otherKey: 'personId'
      });                                 // the people that have specific needs or data (e.g the reserver for the reservation, the people that have allergies ect)
      Schedule.hasMany(models.Boat);      // the boats that will be moved on the trip
      Schedule.hasMany(models.Trip);      // the trip(s) that will move all the people and boats to the right place (might need more than one if above 12, and more than 2 if above 20)
    };
  
    return Schedule;
  };
  
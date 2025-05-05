module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('Person', {
      allergies: DataTypes.STRING,                                                        // the person's allergies (if they have any)
      name: DataTypes.STRING                                                              // the person's name (if given)
    });
  
    Person.associate = (models) => {
      Person.belongsToMany(models.Schedule, {
        through: 'PersonSchedule',
        foreignKey: 'personId',
        otherKey: 'scheduleId'
      });                                                                                 // the schedules the person is part of
      Person.belongsToMany(models.Trip, {
        through: 'PersonTrip',
        foreignKey: 'personId',
        otherKey: 'tripId'
      });                                                                                 // the trips that the person is going on
      Person.hasOne(models.Reservation, {as: 'reservation', foreignKey: 'reserver' });    // the reservation the person is in
    };
  
    return Person;
  };
  
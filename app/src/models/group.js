module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    numberOfPeople: DataTypes.INTEGER,                                      // the number of people that are in the group, including those without information
  });

  Group.associate = (models) => {
    Group.belongsToMany(models.Person, {
      through: 'PersonGroup',
      foreignKey: 'groupId',
      otherKey: 'personId'
    });                                                                     // the people that have specific needs or data (e.g the reserver for the reservation, the people that have allergies ect)
    Group.belongsToMany(models.Boat, {
      through: 'GroupBoat',
      foreignKey: 'groupId',
      otherKey: 'boatId'
    });                                                                     // the boats that will be moved on the trip
    Group.belongsToMany(models.Trip, {
      through: 'GroupTrip',
      foreignKey: 'groupId',
      otherKey: 'tripId'
    });                                                                     // the trip(s) that will move all the people and boats to the wanted place
    Group.hasMany(models.Reservation);                                     // the reservations the group is part of
    Group.hasOne(models.Person, {as: 'leader', foreignKey: 'leaderFor' });    // the group leader
  };

  return Group;
};
module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('Person', {
      allergies: DataTypes.STRING,                                                        // the person's allergies (if they have any)
      name: DataTypes.STRING                                                              // the person's name (if given)
    });
  
    Person.associate = (models) => {
      Person.belongsToMany(models.Group, {
        through: 'PersonGroup',
        foreignKey: 'personId',
        otherKey: 'groupId'
      });                                                                              // the trips that the person is going on
      Person.hasMany(models.Group, { foreignKey: 'GroupLeader', as: 'leaderFor' });
    };
  
    return Person;
  };
  
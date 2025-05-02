module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('Person', {
      allergies: DataTypes.STRING,
      name: DataTypes.STRING
    });
  
    Person.associate = (models) => {
      Person.belongsToMany(models.Schedule, { through: 'plans' });
      Person.hasOne(models.Reservation, {as: 'reservation', foreignKey: 'reserver' });
    };
  
    return Person;
  };
  
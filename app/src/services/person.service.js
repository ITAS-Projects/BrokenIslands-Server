const db = require('../models');
const Person = db.Person;
const Group = db.Group;
const Trip = db.Trip;
const Reservation = db.Reservation;
const Boat = db.Boat;

const getAll = async () => {
  return await Person.findAll({
    include: [
      {
        model: Group,
        through: { attributes: [] } // This hides the join table data (PersonSchedule)
      },
      {
        model: Group,
        as: "leaderFor",
        include: [
          {
            model: Reservation,
          }
        ]
      },
    ]
  });
};

const getById = async (id) => {
  return await Person.findByPk(id, {
    include: [
      {
        model: Group,
        through: { attributes: [] } // This hides the join table data (PersonSchedule)
      },
      {
        model: Group,
        as: "leaderFor",
        include: [
          {
            model: Reservation,
          }
        ]
      },
    ]
  });
};

const create = async (data) => {
  const { GroupIds, ...personData } = data;

  const person = await Person.create(personData);

  if (GroupIds) {
    await person.setGroups(GroupIds);
  }

  return person;
};

const update = async (id, data) => {
  const { GroupIds, ...personData } = data;

  const person = await Person.findByPk(id);
  if (!person) {
    throw new Error('Person not found');
  }

  await person.update(personData);

  if (GroupIds) {
    await person.setGroups(GroupIds);
  }

  return person;
};



const deleteOne = async (id) => {
  const person = await Person.findByPk(id);
  return await person.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

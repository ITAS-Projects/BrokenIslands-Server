const db = require('../models');
const Boat = db.Boat;
const Group = db.Group;
const Trip = db.Trip;
const Taxi = db.Taxi;
const Reservation = db.Reservation;
const Person = db.Person;

const getAll = async () => {
  return await Trip.findAll({
    include: [
      {
        model: Taxi
      },
      {
        model: Group,
        through: { attributes: [] },
        include: [
          {
            model: Boat,
          },
          {
            model: Person,
            as: 'leader'
          }
        ]
      },
      {
        model: Reservation,
        through: { attributes: [] },
        include: [
          {
            model: Group,
            include: [
              {
                model: Person,
                as: 'leader'
              }
            ]
          },
          {
            model: Boat,
          }
        ]
      },
      {
        model: Group,
        as: 'People',
        include: [
          {
            model: Boat,
          },
          {
            model: Person,
            as: 'leader'
          }
        ]
      },
    ]
  });
};

const getById = async (id) => {
  return await Trip.findByPk(id, {
    include: [
      {
        model: Taxi
      },
      {
        model: Group,
        through: { attributes: [] },
        include: [
          {
            model: Boat,
          },
          {
            model: Person,
            as: 'leader'
          }
        ]
      },
      {
        model: Reservation,
        through: { attributes: [] },
        include: [
          {
            model: Group,
            include: [
              {
                model: Person,
                as: 'leader'
              }
            ]
          },
          {
            model: Boat,
          }
        ]
      },
      {
        model: Group,
        as: 'People',
        include: [
          {
            model: Boat,
          },
          {
            model: Person,
            as: 'leader'
          }
        ]
      },
    ]
  });
};


const create = async (data) => {
  const { GroupIds, ReservationIds, ...tripData } = data;

  const trip = await Trip.create(tripData);

  if (GroupIds) {
    await trip.setGroups(GroupIds);
  }

  if (ReservationIds) {
    await trip.setReservations(ReservationIds);
  }

  return trip;
};


const update = async (id, data) => {
  const { GroupIds, ReservationIds, ...tripData } = data;

  const trip = await Trip.findByPk(id);
  if (!trip) {
    throw new Error('Trip not found');
  }

  await trip.update(tripData);

  if (GroupIds) {
    await trip.setGroups(GroupIds);
  }

  if (ReservationIds) {
    await trip.setReservations(ReservationIds);
  }

  return trip;
};



const deleteOne = async (id) => {
  const trip = await Trip.findByPk(id);
  return await trip.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

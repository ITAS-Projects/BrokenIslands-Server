const db = require('../models');
const Boat = db.Boat;
const Trip = db.Trip;
const Schedule = db.Schedule;

const getAll = async () => {
  return await Boat.findAll({
    include: [
      {
        model: Trip,
        through: { attributes: [] } // assuming many-to-many
      },
      {
        model: Schedule,
        through: { attributes: [] } // assuming many-to-many
      }
    ]
  });
};

const getById = async (id) => {
  return await Boat.findByPk(id, {
    include: [
      {
        model: Trip,
        through: { attributes: [] } // assuming many-to-many
      },
      {
        model: Schedule,
        through: { attributes: [] } // assuming many-to-many
      }
    ]
  });
};

const create = async (data) => {
  const boat = await Boat.create(data);

  if (data.scheduleIds && Array.isArray(data.scheduleIds) && data.scheduleIds.length > 0) {
    await boat.addSchedules(data.scheduleIds);
  }

  if (data.tripIds && Array.isArray(data.tripIds) && data.tripIds.length > 0) {
    await boat.addTrips(data.tripIds);
  }

  return boat;
};

const update = async (id, data) => {
  const boat = await Boat.findByPk(id);
  if (!boat) {
    throw new Error('Boat not found');
  }

  await boat.update(data);

  if (data.scheduleIds && Array.isArray(data.scheduleIds) && data.scheduleIds.length > 0) {
    await boat.setSchedules(data.scheduleIds);
  }

  if (data.tripIds && Array.isArray(data.tripIds) && data.tripIds.length > 0) {
    await boat.setTrips(data.tripIds);
  }

  return boat;
};

const deleteOne = async (id) => {
  const item = await Boat.findByPk(id);
  return await item.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};

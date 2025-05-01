const People = require('../models/people'); // Import the People model

const peopleService = {
  // Get all people from the database
  async getAllPeople() {
    try {
      return await People.getAll();
    } catch (err) {
      throw new Error('Error fetching people: ' + err.message);
    }
  },

  // Get person by ID
  async getPersonById(personId) {
    try {
      return await People.getById(personId);
    } catch (err) {
      throw new Error('Error fetching person by ID: ' + err.message);
    }
  },

  // Create a new person
  async createPerson(name, email) {
    try {
      return await People.create(name, email);
    } catch (err) {
      throw new Error('Error creating person: ' + err.message);
    }
  },

  // Update a person by ID
  async updatePerson(personId, name, email) {
    try {
      return await People.update(personId, name, email);
    } catch (err) {
      throw new Error('Error updating person: ' + err.message);
    }
  },

  // Delete a person by ID
  async deletePerson(personId) {
    try {
      return await People.delete(personId);
    } catch (err) {
      throw new Error('Error deleting person: ' + err.message);
    }
  }
};

module.exports = peopleService;

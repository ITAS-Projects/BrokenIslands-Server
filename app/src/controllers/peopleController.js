const peopleService = require('../services/peopleService');

const peopleController = {
  // Get all people
  getAllPeople: async (req, res) => {
    try {
      const people = await peopleService.getAllPeople();
      res.status(200).json(people);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get a person by ID
  getPersonById: async (req, res) => {
    const personId = req.params.id;
    try {
      const person = await peopleService.getPersonById(personId);
      if (person) {
        res.status(200).json(person);
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create a new person
  createPerson: async (req, res) => {
    const { name, email } = req.body;
    try {
      const newPerson = await peopleService.createPerson(name, email);
      res.status(201).json({ message: "Person created", id: newPerson.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update a person by ID
  updatePerson: async (req, res) => {
    const personId = req.params.id;
    const { name, email } = req.body;
    try {
      const updatedPerson = await peopleService.updatePerson(personId, name, email);
      res.status(200).json(updatedPerson);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a person by ID
  deletePerson: async (req, res) => {
    const personId = req.params.id;
    try {
      await peopleService.deletePerson(personId);
      res.status(200).json({ message: 'Person deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = peopleController;

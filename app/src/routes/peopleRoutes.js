const express = require('express');
const router = express.Router();
const peopleController = require('../controllers/peopleController');

// Get all people
router.get('/', peopleController.getAllPeople);

// Get a person by ID
router.get('/:id', peopleController.getPersonById);

// Create a new person
router.post('/', peopleController.createPerson);

// Edit a person by ID
router.put('/:id', peopleController.updatePerson); // New route for updating a person

// Delete a person by ID
router.delete('/:id', peopleController.deletePerson); // New route for deleting a person

module.exports = router;

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

router.get('/', tripController.getAll);
router.get('/:id', tripController.getById);
router.post('/', tripController.create);
router.put('/:id', tripController.update);
router.delete('/:id', tripController.delete);

module.exports = router;

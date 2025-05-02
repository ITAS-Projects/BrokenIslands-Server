const express = require('express');
const router = express.Router();
const taxiController = require('../controllers/taxi.controller');

router.get('/', taxiController.getAll);
router.get('/:id', taxiController.getById);
router.post('/', taxiController.create);
router.put('/:id', taxiController.update);
router.delete('/:id', taxiController.delete);

module.exports = router;

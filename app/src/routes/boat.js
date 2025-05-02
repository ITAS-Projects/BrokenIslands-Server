const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boat.controller');

router.get('/', boatController.getAll);
router.get('/:id', boatController.getById);
router.post('/', boatController.create);
router.put('/:id', boatController.update);
router.delete('/:id', boatController.delete);

module.exports = router;

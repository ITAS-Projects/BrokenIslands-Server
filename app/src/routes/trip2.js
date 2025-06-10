const express = require('express');
const router = express.Router();
const trip2Controller = require('../controllers/trip2.controller');
const { validateUserHasPermissions } = require('../middleware/auth');

router.get('/', trip2Controller.getAll);
router.get('/:id', trip2Controller.getById);
router.post('/', trip2Controller.create);
router.put('/:id', trip2Controller.update);
router.delete('/:id', trip2Controller.delete);

module.exports = router;

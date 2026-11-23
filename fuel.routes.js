const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuel.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, fuelController.getFuelRecords);
router.post('/', verifyToken, fuelController.addFuelRecord);
router.delete('/:id', verifyToken, fuelController.deleteFuelRecord);

module.exports = router;

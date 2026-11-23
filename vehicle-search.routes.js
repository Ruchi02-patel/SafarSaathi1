const express = require('express');
const router = express.Router();
const vehicleSearchController = require('../controllers/vehicle-search.controller');

router.get('/:regNumber', vehicleSearchController.searchVehicle);

module.exports = router;

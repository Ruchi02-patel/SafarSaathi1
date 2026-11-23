const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locations.controller');

router.get('/', locationsController.getLocations);
router.get('/:id', locationsController.getLocationById);

module.exports = router;

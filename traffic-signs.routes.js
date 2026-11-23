const express = require('express');
const router = express.Router();
const trafficSignsController = require('../controllers/traffic-signs.controller');

router.get('/', trafficSignsController.getTrafficSigns);
router.get('/:id', trafficSignsController.getTrafficSignById);

module.exports = router;

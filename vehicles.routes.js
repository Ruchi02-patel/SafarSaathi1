const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehicles.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, vehiclesController.getVehicles);
router.get('/:id', verifyToken, vehiclesController.getVehicleById);
router.post('/', verifyToken, vehiclesController.createVehicle);
router.put('/:id', verifyToken, vehiclesController.updateVehicle);
router.delete('/:id', verifyToken, vehiclesController.deleteVehicle);

module.exports = router;

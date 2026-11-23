const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, servicesController.getServices);
router.post('/', verifyToken, servicesController.createService);
router.put('/:id', verifyToken, servicesController.updateService);
router.delete('/:id', verifyToken, servicesController.deleteService);

module.exports = router;

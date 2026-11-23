const express = require('express');
const router = express.Router();
const mechanicsController = require('../controllers/mechanics.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', mechanicsController.getMechanics);
router.get('/:id', mechanicsController.getMechanicById);
router.post('/', verifyToken, requireAdmin, mechanicsController.createMechanic);

module.exports = router;

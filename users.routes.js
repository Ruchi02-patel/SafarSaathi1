const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/profile', verifyToken, usersController.getProfile);
router.put('/profile', verifyToken, usersController.updateProfile);
router.put('/change-password', verifyToken, usersController.changePassword);

module.exports = router;


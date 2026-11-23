const express = require('express');
const router = express.Router();
const teachersController = require('../controllers/driving-teachers.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', teachersController.getDrivingTeachers);
router.get('/:id', teachersController.getDrivingTeacherById);
router.post('/', verifyToken, requireAdmin, teachersController.createDrivingTeacher);

module.exports = router;

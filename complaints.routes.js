const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaints.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/my', verifyToken, complaintsController.getMyComplaints);
router.post('/', verifyToken, complaintsController.submitComplaint);
router.get('/admin/all', verifyToken, requireAdmin, complaintsController.getAllComplaintsAdmin);
router.put('/admin/:id/status', verifyToken, requireAdmin, complaintsController.updateComplaintStatusAdmin);

module.exports = router;

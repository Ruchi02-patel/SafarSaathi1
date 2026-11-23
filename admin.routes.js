const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const loansController = require('../controllers/loans.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// Apply verifyToken and requireAdmin to all routes in this file
router.use(verifyToken, requireAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/vehicles', adminController.getVehicles);
router.delete('/vehicles/:id', adminController.deleteVehicle);
router.get('/reports', adminController.getReports);

// Admin Loan management routes
router.get('/loans', loansController.getAllLoans);
router.put('/loans/:id/status', loansController.updateLoanStatus);

module.exports = router;

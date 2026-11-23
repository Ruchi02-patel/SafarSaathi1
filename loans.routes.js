const express = require('express');
const router = express.Router();
const loansController = require('../controllers/loans.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// Citizen routes
router.get('/my-loans', verifyToken, loansController.getMyLoans);
router.post('/apply', verifyToken, loansController.applyLoan);
router.post('/', verifyToken, loansController.applyLoan);

// Flexible list route: returns user's loans for citizen, all loans for admin
router.get('/', verifyToken, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return loansController.getAllLoans(req, res, next);
  }
  return loansController.getMyLoans(req, res, next);
});

// Admin status update
router.put('/:id/status', verifyToken, requireAdmin, loansController.updateLoanStatus);

module.exports = router;

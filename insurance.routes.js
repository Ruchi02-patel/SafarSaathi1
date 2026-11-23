const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insurance.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/my-policies', verifyToken, insuranceController.getMyPolicies);
router.get('/plans', insuranceController.getInsurancePlans);
router.post('/apply', verifyToken, insuranceController.applyInsurance);

module.exports = router;

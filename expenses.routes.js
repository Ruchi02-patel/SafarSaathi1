const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, expensesController.getExpenses);
router.post('/', verifyToken, expensesController.createExpense);
router.put('/:id', verifyToken, expensesController.updateExpense);
router.delete('/:id', verifyToken, expensesController.deleteExpense);

module.exports = router;

const { Expense, Vehicle } = require('../models');

// @desc    Get all user expenses with summary statistics (Total, This Month, This Year)
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const { vehicleId, category } = req.query;
    let query = { userId: req.user.id };

    if (vehicleId && vehicleId !== 'All') {
      query.vehicleId = vehicleId;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const expenses = await Expense.find(query)
      .populate('vehicleId', 'vehicleNumber brand model')
      .sort({ date: -1 });

    // Calculate analytics
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalExpenses = 0;
    let thisMonthExpenses = 0;
    let thisYearExpenses = 0;

    // Category breakdown
    const categoryBreakdown = {};

    expenses.forEach((item) => {
      const expDate = new Date(item.date);
      totalExpenses += item.amount;

      if (expDate.getFullYear() === currentYear) {
        thisYearExpenses += item.amount;
        if (expDate.getMonth() === currentMonth) {
          thisMonthExpenses += item.amount;
        }
      }

      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + item.amount;
    });

    res.json({
      success: true,
      count: expenses.length,
      stats: {
        totalExpenses,
        thisMonthExpenses,
        thisYearExpenses,
        categoryBreakdown
      },
      summary: {
        totalAmount: totalExpenses,
        thisMonthAmount: thisMonthExpenses,
        thisYearAmount: thisYearExpenses
      },
      expenses,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new vehicle expense
// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { vehicleId, category, amount, description, date, paymentMethod } = req.body;

    if (!vehicleId || !category || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle, category, amount, and description are required.'
      });
    }

    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    if (vehicle.userId.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this vehicle.' });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      vehicleId,
      category,
      amount: Number(amount),
      description: description.trim(),
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI'
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully!',
      expense
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vehicle expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    if (expense.userId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this expense' });
    }

    const { category, amount, description, date, paymentMethod, vehicleId } = req.body;
    if (category) expense.category = category;
    if (amount) expense.amount = Number(amount);
    if (description) expense.description = description.trim();
    if (date) expense.date = new Date(date);
    if (paymentMethod) expense.paymentMethod = paymentMethod;
    if (vehicleId) expense.vehicleId = vehicleId;

    await expense.save();

    res.json({
      success: true,
      message: 'Expense updated successfully!',
      expense
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete vehicle expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    if (expense.userId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();

    res.json({
      success: true,
      message: 'Expense record deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

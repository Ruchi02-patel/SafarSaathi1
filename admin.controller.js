const {
  User,
  Vehicle,
  Mechanic,
  Insurance,
  Expense,
  ServiceMaintenance,
  ComplaintFeedback,
  Loan
} = require('../models');

// @desc    Admin dashboard summary stats & chart data
// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalVehicles,
      totalMechanics,
      totalInsurance,
      expenses,
      services,
      complaints,
      loans
    ] = await Promise.all([
      User.countDocuments(),
      Vehicle.countDocuments(),
      Mechanic.countDocuments(),
      Insurance.countDocuments(),
      Expense.find(),
      ServiceMaintenance.countDocuments(),
      ComplaintFeedback.countDocuments(),
      Loan.countDocuments()
    ]);

    const totalExpenseAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

    // Vehicle types breakdown
    const vehicleTypes = await Vehicle.aggregate([
      { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
    ]);

    // Fuel types breakdown
    const fuelTypes = await Vehicle.aggregate([
      { $group: { _id: '$fuelType', count: { $sum: 1 } } }
    ]);

    // Recent 5 users
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);

    // Recent 5 vehicles
    const recentVehicles = await Vehicle.find().populate('userId', 'fullName email').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVehicles,
        totalMechanics,
        totalInsurance,
        totalExpenses: totalExpenseAmount,
        totalServices: services,
        totalComplaints: complaints,
        totalLoans: loans
      },
      charts: {
        vehicleTypes,
        fuelTypes
      },
      recentUsers,
      recentVehicles
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: List all users with search & pagination
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Include vehicle count for each user
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const vCount = await Vehicle.countDocuments({ userId: u._id });
        return {
          ...u.toObject(),
          vehicleCount: vCount
        };
      })
    );

    res.json({
      success: true,
      count: usersWithCounts.length,
      users: usersWithCounts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Toggle user status (Active / Inactive)
// @route   PUT /api/admin/users/:id/status
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status || (user.status === 'Active' ? 'Inactive' : 'Active');
    await user.save();

    res.json({
      success: true,
      message: `User status updated to ${user.status}`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Delete user and their vehicles
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await Vehicle.deleteMany({ userId: user._id });
    await Expense.deleteMany({ userId: user._id });
    await ServiceMaintenance.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and all associated records deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: List all registered vehicles
// @route   GET /api/admin/vehicles
exports.getVehicles = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const vehicles = await Vehicle.find(query).populate('userId', 'fullName email phone').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Delete vehicle
// @route   DELETE /api/admin/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.json({
      success: true,
      message: 'Vehicle deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Generate comprehensive reports
// @route   GET /api/admin/reports
exports.getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();

    // Expenses total
    const expenses = await Expense.find();
    const totalExpenseAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

    // Loans value
    const loans = await Loan.find({ status: 'Approved' });
    const totalApprovedLoanAmount = loans.reduce((sum, item) => sum + item.loanAmount, 0);

    // Vehicle types aggregation
    const vehicleTypes = await Vehicle.aggregate([
      { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
    ]);

    // Fuel types aggregation
    const fuelTypes = await Vehicle.aggregate([
      { $group: { _id: '$fuelType', count: { $sum: 1 } } }
    ]);

    // Expenses by Category
    const expensesByCategory = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      summary: {
        totalUsers,
        totalVehicles,
        totalRevenueOrLoans: totalApprovedLoanAmount || 0,
        totalExpenses: totalExpenseAmount || 0
      },
      charts: {
        vehicleTypes,
        fuelTypes,
        expensesByCategory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const { Loan, Vehicle, Notification } = require('../models');

// Helper to calculate simple EMI: P * r * (1 + r)^n / ((1 + r)^n - 1)
const calculateEmi = (principal, annualRate, months) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
};

// @desc    Get current user's loans
// @route   GET /api/loans/my-loans
exports.getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id })
      .populate('vehicleId', 'vehicleNumber brand model')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: loans.length,
      loans,
      data: loans
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a vehicle loan
// @route   POST /api/loans/apply or POST /api/loans
exports.applyLoan = async (req, res) => {
  try {
    const { vehicleId, loanAmount, tenureMonths, employmentType, monthlyIncome, bankName, lenderName, interestRate } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ success: false, message: 'Please select a vehicle for loan financing.' });
    }
    if (!loanAmount || Number(loanAmount) <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid loan amount.' });
    }
    if (!tenureMonths || Number(tenureMonths) <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid loan tenure in months.' });
    }
    if (!employmentType) {
      return res.status(400).json({ success: false, message: 'Please select your employment type.' });
    }
    if (!monthlyIncome || Number(monthlyIncome) <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter your monthly income.' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Selected vehicle not found in database.' });
    }
    if (vehicle.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not own this vehicle.' });
    }

    const principal = Number(loanAmount);
    const months = Number(tenureMonths);
    const rate = Number(interestRate) || 8.5; // standard vehicle loan rate %
    const estimatedEmi = calculateEmi(principal, rate, months);

    const loan = await Loan.create({
      userId: req.user.id,
      vehicleId,
      loanAmount: principal,
      tenureMonths: months,
      employmentType,
      monthlyIncome: Number(monthlyIncome),
      bankName: bankName || lenderName || 'HDFC Bank',
      interestRate: rate,
      estimatedEmi,
      status: 'Pending',
      appliedDate: new Date()
    });

    // Notify user of submitted application
    try {
      await Notification.create({
        userId: req.user.id,
        vehicleId: vehicle._id,
        title: 'Vehicle Loan Application Submitted',
        message: `Your application for ₹${principal.toLocaleString('en-IN')} vehicle loan on ${vehicle.brand} ${vehicle.model} has been submitted (Ref: ${loan._id}).`,
        type: 'Loan Update',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    } catch (notifErr) {
      console.warn('Loan submission notification skipped:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully!',
      loan
    });
  } catch (error) {
    console.error('Apply loan error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all loan applications
// @route   GET /api/loans or GET /api/admin/loans
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('userId', 'fullName email phone')
      .populate('vehicleId', 'vehicleNumber brand model')
      .sort({ appliedDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: loans.length,
      loans,
      data: loans
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Update loan status (Approve / Reject)
// @route   PUT /api/loans/:id/status or PUT /api/admin/loans/:id/status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid loan status. Must be Pending, Approved, or Rejected.' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan application not found.' });
    }

    loan.status = status;
    if (remarks !== undefined) loan.remarks = remarks;
    await loan.save();

    // Notify user of decision
    try {
      await Notification.create({
        userId: loan.userId,
        vehicleId: loan.vehicleId,
        title: `Vehicle Loan ${status}`,
        message: `Your vehicle loan application has been ${status.toLowerCase()}.${remarks ? ' Note: ' + remarks : ''}`,
        type: 'Loan Update',
        dueDate: new Date()
      });
    } catch (notifErr) {
      console.warn('Loan status notification skipped:', notifErr.message);
    }

    res.json({
      success: true,
      message: `Loan application marked as ${status}.`,
      loan
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const { Insurance, InsurancePlan, Vehicle, Notification, Expense } = require('../models');

// @desc    Get user's insurance policies
// @route   GET /api/insurance/my-policies
exports.getMyPolicies = async (req, res) => {
  try {
    const policies = await Insurance.find({ userId: req.user.id })
      .populate('vehicleId', 'vehicleNumber brand model vehicleType')
      .sort({ expiryDate: -1 });

    res.json({
      success: true,
      count: policies.length,
      policies,
      data: policies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get available insurance plans to compare
// @route   GET /api/insurance/plans
exports.getInsurancePlans = async (req, res) => {
  try {
    const { planType } = req.query;
    const filter = { status: 'Active' };
    if (planType && planType !== 'All') {
      filter.planType = planType;
    }

    const plans = await InsurancePlan.find(filter).sort({ premiumAmount: 1 });
    res.json({
      success: true,
      count: plans.length,
      plans,
      data: plans
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Purchase / Apply for an insurance policy on a vehicle
// @route   POST /api/insurance/apply
exports.applyInsurance = async (req, res) => {
  try {
    const { vehicleId, planId, policyNumber, companyName, planName, coverageAmount, premiumAmount, durationYears } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ success: false, message: 'Please select a vehicle.' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    if (vehicle.userId.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this vehicle.' });
    }

    const years = durationYears ? parseInt(durationYears, 10) : 1;
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + years);
    const premium = premiumAmount ? Number(premiumAmount) : 12421;

    const policy = await Insurance.create({
      vehicleId,
      userId: req.user.id,
      policyNumber: policyNumber || `POL-${Date.now().toString().slice(-8)}`,
      companyName: companyName || 'HDFC ERGO General Insurance',
      planName: planName || 'Comprehensive Motor Cover',
      coverageAmount: coverageAmount ? Number(coverageAmount) : 500000,
      premiumAmount: premium,
      startDate,
      expiryDate,
      status: 'Active'
    });

    // Update vehicle's insurance dates
    vehicle.insuranceStartDate = startDate;
    vehicle.insuranceExpiryDate = expiryDate;
    await vehicle.save();

    // Auto-create insurance expense
    await Expense.create({
      userId: req.user.id,
      vehicleId: vehicle._id,
      category: 'Insurance',
      amount: premium,
      description: `Insurance policy ${policy.policyNumber} (${policy.companyName} - ${policy.planName})`,
      date: startDate,
      paymentMethod: 'Net Banking'
    });

    // Create confirmation notification
    await Notification.create({
      userId: req.user.id,
      vehicleId: vehicle._id,
      title: 'Insurance Policy Activated',
      message: `Your insurance policy #${policy.policyNumber} for ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber}) is now active until ${expiryDate.toLocaleDateString('en-IN')}.`,
      type: 'Insurance Expiry',
      daysLeft: 365 * years,
      dueDate: expiryDate
    });

    res.status(201).json({
      success: true,
      message: 'Insurance policy successfully linked and activated!',
      policy
    });
  } catch (error) {
    console.error('Insurance apply error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const {
  Vehicle,
  VehicleDocument,
  Insurance,
  ServiceMaintenance,
  Expense,
  Notification,
  FuelRecord,
  Loan
} = require('../models');

// Helper to determine status and days remaining
const calculateValidity = (expiryDate) => {
  if (!expiryDate) return { status: 'Unknown', daysLeft: null };
  const diffTime = new Date(expiryDate).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) {
    return { status: 'Expired', daysLeft: Math.abs(daysLeft), isExpired: true };
  } else if (daysLeft <= 30) {
    return { status: 'Expiring Soon', daysLeft, isExpiringSoon: true };
  }
  return { status: 'Active', daysLeft, isActive: true };
};

// @desc    Get all vehicles for current user
// @route   GET /api/vehicles
exports.getVehicles = async (req, res) => {
  try {
    const filter = req.user.role === 'Admin' || req.user.role === 'Super Admin' 
      ? {} 
      : { userId: req.user.id };

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

    // Enrich each vehicle with calculated fields for UI
    const enrichedVehicles = await Promise.all(
      vehicles.map(async (v) => {
        const insValidity = calculateValidity(v.insuranceExpiryDate);
        
        // Find latest service
        const latestService = await ServiceMaintenance.findOne({ vehicleId: v._id }).sort({ nextServiceDate: 1 });
        let nextServiceDays = null;
        let nextServiceStatus = 'No Scheduled Service';
        if (latestService && latestService.nextServiceDate) {
          const diff = new Date(latestService.nextServiceDate).getTime() - new Date().getTime();
          nextServiceDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
          nextServiceStatus = nextServiceDays < 0 ? 'Overdue' : `${nextServiceDays} Days`;
        }

        // Sum expenses
        const expenses = await Expense.find({ vehicleId: v._id });
        const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

        return {
          ...v.toObject(),
          insuranceStatus: insValidity.status,
          insuranceDaysLeft: insValidity.daysLeft,
          nextServiceDays,
          nextServiceStatus,
          totalExpenses
        };
      })
    );

    res.json({
      success: true,
      count: enrichedVehicles.length,
      vehicles: enrichedVehicles,
      data: enrichedVehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single vehicle details by ID
// @route   GET /api/vehicles/:id
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Check ownership if not admin
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'Super Admin' &&
      vehicle.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this vehicle' });
    }

    // Fetch related records
    const documents = await VehicleDocument.find({ vehicleId: vehicle._id }).sort({ uploadDate: -1 });
    const insuranceRecords = await Insurance.find({ vehicleId: vehicle._id }).sort({ expiryDate: -1 });
    const services = await ServiceMaintenance.find({ vehicleId: vehicle._id }).sort({ serviceDate: -1 });
    const expenses = await Expense.find({ vehicleId: vehicle._id }).sort({ date: -1 });

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const insValidity = calculateValidity(vehicle.insuranceExpiryDate);
    const pucValidity = calculateValidity(vehicle.pucExpiryDate);

    // Latest upcoming service
    const nextService = services.find(s => s.status === 'Upcoming' || new Date(s.nextServiceDate) >= new Date());
    let nextServiceInfo = 'No service scheduled';
    if (nextService && nextService.nextServiceDate) {
      const diff = new Date(nextService.nextServiceDate).getTime() - new Date().getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      nextServiceInfo = days < 0 ? 'Overdue' : `${days} Days`;
    }

    res.json({
      success: true,
      vehicle: {
        ...vehicle.toObject(),
        insuranceStatus: insValidity.status,
        insuranceDaysLeft: insValidity.daysLeft,
        pucStatus: pucValidity.status,
        pucDaysLeft: pucValidity.daysLeft,
        nextServiceInfo,
        totalExpenses
      },
      documents,
      insuranceRecords,
      services,
      expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new vehicle
// @route   POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    const vNumber = (req.body.vehicleNumber || req.body.registrationNumber || '').toUpperCase().trim();
    const vBrand = (req.body.brand || req.body.vehicleBrand || '').trim();
    const vModel = (req.body.model || req.body.modelName || '').trim();
    const ownerName = (req.body.ownerName || '').trim();
    const city = (req.body.city || '').trim();
    const state = (req.body.state || '').trim();
    const phoneNumber = (req.body.phoneNumber || '').trim();
    const vehicleType = req.body.vehicleType || '4 Wheeler';
    const fuelType = req.body.fuelType || 'Petrol';
    const chassisNumber = (req.body.chassisNumber || '').toUpperCase().trim();
    const registrationDate = req.body.registrationDate;
    const insuranceStartDate = req.body.insuranceStartDate;
    const insuranceExpiryDate = req.body.insuranceExpiryDate;
    const pucExpiryDate = req.body.pucExpiryDate;
    const vehicleImage = req.body.vehicleImage || '';

    // Validate required fields
    if (!vNumber || !ownerName || !vBrand || !vModel || !chassisNumber || !registrationDate) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required vehicle details.'
      });
    }

    const vehicleNumber = vNumber;
    const brand = vBrand;
    const model = vModel;


    // Check for duplicate vehicleNumber or chassisNumber
    const existingNum = await Vehicle.findOne({
      vehicleNumber: vehicleNumber.toUpperCase().trim()
    });
    if (existingNum) {
      return res.status(400).json({
        success: false,
        message: `A vehicle with registration number ${vehicleNumber.toUpperCase()} already exists.`
      });
    }

    const existingChassis = await Vehicle.findOne({
      chassisNumber: chassisNumber.toUpperCase().trim()
    });
    if (existingChassis) {
      return res.status(400).json({
        success: false,
        message: `A vehicle with chassis number ${chassisNumber.toUpperCase()} already exists.`
      });
    }

    const vehicle = await Vehicle.create({
      userId: req.user.id,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      ownerName: ownerName.trim(),
      city: city ? city.trim() : 'Ahmedabad',
      state: state ? state.trim() : 'Gujarat',
      phoneNumber: phoneNumber ? phoneNumber.trim() : req.user.phone || '9876543210',
      vehicleType: vehicleType || '4 Wheeler',
      brand: brand.trim(),
      model: model.trim(),
      fuelType: fuelType || 'Petrol',
      chassisNumber: chassisNumber.toUpperCase().trim(),
      registrationDate: new Date(registrationDate),
      insuranceStartDate: insuranceStartDate ? new Date(insuranceStartDate) : undefined,
      insuranceExpiryDate: insuranceExpiryDate ? new Date(insuranceExpiryDate) : undefined,
      pucExpiryDate: pucExpiryDate ? new Date(pucExpiryDate) : undefined,
      vehicleImage: vehicleImage || '',
      status: 'Active'
    });

    // Auto-create initial notification if insurance expiry is set
    if (vehicle.insuranceExpiryDate) {
      const diffDays = Math.ceil((new Date(vehicle.insuranceExpiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 60) {
        await Notification.create({
          userId: req.user.id,
          vehicleId: vehicle._id,
          title: 'Insurance Expiry Reminder',
          message: `Insurance for your ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber}) expires in ${diffDays} days.`,
          type: 'Insurance Expiry',
          daysLeft: diffDays,
          dueDate: vehicle.insuranceExpiryDate
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully!',
      vehicle
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Check ownership if not admin
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'Super Admin' &&
      vehicle.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this vehicle' });
    }

    const {
      ownerName,
      city,
      state,
      phoneNumber,
      vehicleType,
      brand,
      model,
      fuelType,
      registrationDate,
      insuranceStartDate,
      insuranceExpiryDate,
      pucExpiryDate,
      vehicleImage,
      status
    } = req.body;

    if (ownerName) vehicle.ownerName = ownerName.trim();
    if (city) vehicle.city = city.trim();
    if (state) vehicle.state = state.trim();
    if (phoneNumber) vehicle.phoneNumber = phoneNumber.trim();
    const vBrand = req.body.brand || req.body.vehicleBrand;
    if (vBrand) vehicle.brand = vBrand.trim();
    const vModel = req.body.model || req.body.modelName;
    if (vModel) vehicle.model = vModel.trim();
    if (fuelType) vehicle.fuelType = fuelType;

    if (registrationDate) vehicle.registrationDate = new Date(registrationDate);
    if (insuranceStartDate) vehicle.insuranceStartDate = new Date(insuranceStartDate);
    if (insuranceExpiryDate) vehicle.insuranceExpiryDate = new Date(insuranceExpiryDate);
    if (pucExpiryDate) vehicle.pucExpiryDate = new Date(pucExpiryDate);
    if (vehicleImage !== undefined) vehicle.vehicleImage = vehicleImage;
    if (status) vehicle.status = status;

    await vehicle.save();

    res.json({
      success: true,
      message: 'Vehicle updated successfully!',
      vehicle
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Check ownership if not admin
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'Super Admin' &&
      vehicle.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this vehicle' });
    }

    // Clean up associated records
    await VehicleDocument.deleteMany({ vehicleId: vehicle._id });
    await Insurance.deleteMany({ vehicleId: vehicle._id });
    await ServiceMaintenance.deleteMany({ vehicleId: vehicle._id });
    await Expense.deleteMany({ vehicleId: vehicle._id });
    await Notification.deleteMany({ vehicleId: vehicle._id });
    await FuelRecord.deleteMany({ vehicleId: vehicle._id });
    await Loan.deleteMany({ vehicleId: vehicle._id });

    await vehicle.deleteOne();

    res.json({
      success: true,
      message: 'Vehicle and its related records have been deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

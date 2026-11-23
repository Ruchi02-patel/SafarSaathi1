const { VehicleSearch, Vehicle } = require('../models');

// @desc    Search vehicle info by Registration Number
// @route   GET /api/vehicle-search/:regNumber
exports.searchVehicle = async (req, res) => {
  try {
    const rawNumber = req.params.regNumber || '';
    const cleanNumber = rawNumber.replace(/[\s-]/g, '').toUpperCase();

    if (!cleanNumber || cleanNumber.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid registration number (e.g. MH12AB1234).'
      });
    }

    const flexiblePattern = cleanNumber.split('').join('[\\s-]*');
    const searchRegex = new RegExp(`^${flexiblePattern}$`, 'i');

    // 1. Search in dedicated VehicleSearch database
    let record = await VehicleSearch.findOne({
      vehicleNumber: { $regex: searchRegex }
    });

    // 2. If not found, check registered vehicles in SafarSaathi
    if (!record) {
      const liveVehicle = await Vehicle.findOne({
        vehicleNumber: { $regex: searchRegex }
      });

      if (liveVehicle) {
        record = {
          vehicleNumber: liveVehicle.vehicleNumber,
          ownerName: liveVehicle.ownerName,
          vehicleType: liveVehicle.vehicleType,
          brand: liveVehicle.brand,
          model: liveVehicle.model,
          fuelType: liveVehicle.fuelType,
          registrationCity: liveVehicle.city,
          registrationState: liveVehicle.state,
          registrationDate: liveVehicle.registrationDate,
          chassisNumber: liveVehicle.chassisNumber ? `••••${liveVehicle.chassisNumber.slice(-4)}` : 'N/A',
          engineNumber: '••••5678',
          insuranceValidity: liveVehicle.insuranceExpiryDate && new Date(liveVehicle.insuranceExpiryDate) > new Date() ? 'Active' : 'Expired',
          pucValidity: liveVehicle.pucExpiryDate && new Date(liveVehicle.pucExpiryDate) > new Date() ? 'Valid' : 'Expired',
          status: liveVehicle.status
        };
      }
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `No vehicle records found for registration number "${req.params.regNumber}". Note: Database searches local SafarSaathi RTO records.`
      });
    }

    res.json({
      success: true,
      data: record,
      source: 'SafarSaathi Database'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fuel & Mileage Management Controller (Module 4)
// Simple, beginner-friendly code for college viva explanation
const { FuelRecord, Vehicle, Expense } = require('../models');

// @desc    Get all fuel records for logged-in user
// @route   GET /api/fuel
exports.getFuelRecords = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    let query = { userId: req.user.id };

    if (vehicleId) {
      query.vehicleId = vehicleId;
    }

    const records = await FuelRecord.find(query)
      .populate('vehicleId', 'vehicleNumber brand model')
      .sort({ odometerReading: -1, fuelDate: -1 });

    // Calculate overall totals
    let totalCost = 0;
    let totalQuantity = 0;
    let totalDistance = 0;

    for (let i = 0; i < records.length; i++) {
      totalCost += records[i].fuelCost || 0;
      totalQuantity += records[i].fuelQuantity || 0;
      totalDistance += records[i].distanceTravelled || 0;
    }

    // Average Mileage = Total Distance / Total Litres consumed (for records that had distance)
    const averageMileage = totalQuantity > 0 && totalDistance > 0 
      ? Number((totalDistance / totalQuantity).toFixed(2)) 
      : 0;

    res.json({
      success: true,
      count: records.length,
      summary: {
        totalCost,
        totalQuantity: Number(totalQuantity.toFixed(2)),
        totalDistance: Number(totalDistance.toFixed(2)),
        averageMileage
      },
      records
    });
  } catch (error) {
    console.error('Error fetching fuel records:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fuel records.' });
  }
};

// @desc    Add a new fuel record with automatic mileage calculation
// @route   POST /api/fuel
exports.addFuelRecord = async (req, res) => {
  try {
    const { vehicleId, fuelType, fuelQuantity, fuelCost, odometerReading, fuelDate, fuelStation, notes } = req.body;

    if (!vehicleId || !fuelQuantity || !fuelCost || odometerReading === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicle, fuel quantity, cost, and odometer reading.'
      });
    }

    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user.id });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found or unauthorized.' });
    }

    const currentOdo = Number(odometerReading);
    const quantity = Number(fuelQuantity);
    const cost = Number(fuelCost);

    // Find the latest previous fuel record for this vehicle to calculate distance
    const previousRecord = await FuelRecord.findOne({
      vehicleId: vehicleId,
      odometerReading: { $lt: currentOdo }
    }).sort({ odometerReading: -1 });

    let distance = 0;
    let mileage = 0;

    if (previousRecord) {
      distance = currentOdo - previousRecord.odometerReading;
      if (quantity > 0) {
        mileage = Number((distance / quantity).toFixed(2));
      }
    }

    // Create the fuel record
    const newRecord = await FuelRecord.create({
      userId: req.user.id,
      vehicleId,
      fuelType: fuelType || vehicle.fuelType || 'Petrol',
      fuelQuantity: quantity,
      fuelCost: cost,
      odometerReading: currentOdo,
      fuelDate: fuelDate ? new Date(fuelDate) : new Date(),
      fuelStation: fuelStation || '',
      notes: notes || '',
      distanceTravelled: distance,
      calculatedMileage: mileage
    });

    // Also record as vehicle expense so everything stays synced
    await Expense.create({
      userId: req.user.id,
      vehicleId,
      category: 'Fuel',
      amount: cost,
      description: `Fuel refill: ${quantity}L at ${fuelStation || 'Petrol Pump'} (Odo: ${currentOdo} km)`,
      date: fuelDate ? new Date(fuelDate) : new Date(),
      paymentMethod: 'UPI'
    });

    res.status(201).json({
      success: true,
      message: 'Fuel record added successfully!',
      record: newRecord
    });
  } catch (error) {
    console.error('Error adding fuel record:', error);
    res.status(500).json({ success: false, message: 'Failed to add fuel record.' });
  }
};

// @desc    Delete a fuel record
// @route   DELETE /api/fuel/:id
exports.deleteFuelRecord = async (req, res) => {
  try {
    const record = await FuelRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Fuel record not found.' });
    }

    // Clean up corresponding auto-generated expense
    await Expense.findOneAndDelete({
      userId: req.user.id,
      vehicleId: record.vehicleId,
      category: 'Fuel',
      amount: record.fuelCost
    });

    res.json({ success: true, message: 'Fuel record deleted successfully.' });
  } catch (error) {
    console.error('Error deleting fuel record:', error);
    res.status(500).json({ success: false, message: 'Failed to delete fuel record.' });
  }
};

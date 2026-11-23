const mongoose = require('mongoose');

// Schema for Module 4: Fuel and Mileage Management
const fuelRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle reference is required']
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    default: 'Petrol'
  },
  fuelQuantity: {
    type: Number,
    required: [true, 'Fuel quantity in litres is required'],
    min: [0.1, 'Quantity must be greater than 0']
  },
  fuelCost: {
    type: Number,
    required: [true, 'Total fuel cost is required'],
    min: [1, 'Cost must be at least 1']
  },
  odometerReading: {
    type: Number,
    required: [true, 'Current odometer reading is required'],
    min: [0, 'Odometer reading cannot be negative']
  },
  fuelDate: {
    type: Date,
    default: Date.now
  },
  fuelStation: {
    type: String,
    default: '',
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  // Computed values
  distanceTravelled: {
    type: Number,
    default: 0
  },
  calculatedMileage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FuelRecord', fuelRecordSchema);

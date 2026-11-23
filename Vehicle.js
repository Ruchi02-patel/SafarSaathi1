const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner userId is required']
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Registration / Vehicle number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Contact phone number is required'],
    trim: true
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle/Wheel type is required'],
    enum: ['2 Wheeler', '3 Wheeler', '4 Wheeler', 'Commercial', 'Heavy Vehicle'],
    default: '4 Wheeler'
  },
  brand: {
    type: String,
    required: [true, 'Brand / Manufacturer is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    default: 'Petrol'
  },
  chassisNumber: {
    type: String,
    required: [true, 'Chassis number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  registrationDate: {
    type: Date,
    required: [true, 'Registration date is required']
  },
  insuranceStartDate: {
    type: Date
  },
  insuranceExpiryDate: {
    type: Date
  },
  pucExpiryDate: {
    type: Date
  },
  vehicleImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

vehicleSchema.virtual('registrationNumber')
  .get(function() { return this.vehicleNumber; })
  .set(function(v) { this.vehicleNumber = v; });

vehicleSchema.virtual('vehicleBrand')
  .get(function() { return this.brand; })
  .set(function(v) { this.brand = v; });

vehicleSchema.virtual('modelName')
  .get(function() { return this.model; })
  .set(function(v) { this.model = v; });

module.exports = mongoose.model('Vehicle', vehicleSchema);


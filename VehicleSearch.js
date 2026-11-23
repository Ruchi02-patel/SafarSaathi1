const mongoose = require('mongoose');

const vehicleSearchSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle registration number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    default: '4 Wheeler'
  },
  brand: {
    type: String,
    required: [true, 'Brand / Manufacturer is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    default: 'Petrol'
  },
  registrationCity: {
    type: String,
    required: [true, 'Registration city is required'],
    trim: true
  },
  registrationState: {
    type: String,
    required: [true, 'Registration state is required'],
    trim: true
  },
  registrationDate: {
    type: Date,
    required: [true, 'Registration date is required']
  },
  chassisNumber: {
    type: String,
    default: ''
  },
  engineNumber: {
    type: String,
    default: ''
  },
  insuranceValidity: {
    type: String,
    default: 'Active'
  },
  pucValidity: {
    type: String,
    default: 'Valid'
  },
  fitnessValidity: {
    type: String,
    default: 'Valid'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VehicleSearch', vehicleSearchSchema);

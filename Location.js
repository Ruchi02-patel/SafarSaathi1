const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Location type is required'],
    enum: ['Mechanic', 'Petrol Pump', 'RTO Office', 'PUC Center'],
    default: 'Petrol Pump'
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
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
  latitude: {
    type: Number,
    required: [true, 'Latitude is required']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required']
  },
  phone: {
    type: String,
    default: ''
  },
  timing: {
    type: String,
    default: 'Open 24 Hours'
  },
  distanceKm: {
    type: Number,
    default: 1.5
  },
  rating: {
    type: Number,
    default: 4.3
  },
  services: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);

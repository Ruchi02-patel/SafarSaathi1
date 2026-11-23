const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mechanic / Contact name is required'],
    trim: true
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    default: 'General Service & Repair'
  },
  experienceYears: {
    type: Number,
    default: 5
  },
  rating: {
    type: Number,
    default: 4.5
  },
  reviewCount: {
    type: Number,
    default: 50
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
    default: 18.5204
  },
  longitude: {
    type: Number,
    default: 73.8567
  },
  distanceKm: {
    type: Number,
    default: 1.0
  },
  timing: {
    type: String,
    default: '9:00 AM - 8:00 PM'
  },
  servicesOffered: [{
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

module.exports = mongoose.model('Mechanic', mechanicSchema);

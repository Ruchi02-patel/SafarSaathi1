const mongoose = require('mongoose');

const drivingTeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Instructor / School name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  experienceYears: {
    type: Number,
    default: 5
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type taught is required'],
    default: 'Manual & Automatic'
  },
  licenseType: {
    type: String,
    default: 'LMV (Light Motor Vehicle)'
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
  availability: {
    type: String,
    default: 'Mon - Sat (7:00 AM - 7:00 PM)'
  },
  rating: {
    type: Number,
    default: 4.8
  },
  reviewCount: {
    type: Number,
    default: 120
  },
  hourlyRate: {
    type: Number,
    default: 450
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DrivingTeacher', drivingTeacherSchema);

const mongoose = require('mongoose');

const serviceMaintenanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle reference is required']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    default: 'General Service'
  },
  serviceDate: {
    type: Date,
    required: [true, 'Service date is required'],
    default: Date.now
  },
  nextServiceDate: {
    type: Date,
    required: [true, 'Next service due date is required']
  },
  mileage: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    required: [true, 'Service cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  description: {
    type: String,
    default: ''
  },
  serviceCenter: {
    type: String,
    required: [true, 'Service center name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Upcoming', 'In Progress'],
    default: 'Completed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceMaintenance', serviceMaintenanceSchema);

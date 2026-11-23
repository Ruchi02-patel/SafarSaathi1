const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle reference is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  policyNumber: {
    type: String,
    required: [true, 'Policy number is required'],
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Insurance company name is required'],
    trim: true
  },
  planName: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
  },
  coverageAmount: {
    type: Number,
    required: [true, 'Coverage amount is required']
  },
  premiumAmount: {
    type: Number,
    required: [true, 'Premium amount is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Policy start date is required']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Policy expiry date is required']
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Renewed', 'Pending'],
    default: 'Active'
  },
  policyDocument: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Insurance', insuranceSchema);

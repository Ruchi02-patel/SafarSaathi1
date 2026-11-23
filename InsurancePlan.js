const mongoose = require('mongoose');

const insurancePlanSchema = new mongoose.Schema({
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
  planType: {
    type: String,
    enum: ['Comprehensive', 'Third Party', 'Zero Depreciation', 'Standard'],
    default: 'Comprehensive'
  },
  features: [{
    type: String
  }],
  duration: {
    type: String,
    default: '1 Year'
  },
  rating: {
    type: Number,
    default: 4.5
  },
  claimSettlementRatio: {
    type: String,
    default: '98%'
  },
  logo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);

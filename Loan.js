const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
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
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required']
  },
  tenureMonths: {
    type: Number,
    required: [true, 'Tenure in months is required']
  },
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: ['Salaried', 'Self-Employed', 'Business', 'Professional', 'Other']
  },
  monthlyIncome: {
    type: Number,
    required: [true, 'Monthly income is required']
  },
  bankName: {
    type: String,
    default: 'HDFC Bank'
  },
  interestRate: {
    type: Number,
    default: 8.5
  },
  estimatedEmi: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    default: ''
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: [true, 'Expense category is required'],
    enum: ['Fuel', 'Repair', 'Service', 'Insurance', 'Toll/Tax', 'Others'],
    default: 'Fuel'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date of expense is required'],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking'],
    default: 'UPI'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);

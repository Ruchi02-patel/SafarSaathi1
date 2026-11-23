const mongoose = require('mongoose');

const trafficSignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sign name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Warning', 'Regulatory', 'Informative'],
    default: 'Regulatory'
  },
  meaning: {
    type: String,
    required: [true, 'Sign meaning is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Sign description is required'],
    trim: true
  },
  symbol: {
    type: String,
    default: ''
  },
  code: {
    type: String,
    default: ''
  },
  shape: {
    type: String,
    default: 'Circle'
  },
  color: {
    type: String,
    default: 'Red'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrafficSign', trafficSignSchema);

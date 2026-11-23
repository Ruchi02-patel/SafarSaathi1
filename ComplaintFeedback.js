const mongoose = require('mongoose');

const complaintFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Complaint', 'Feedback'],
    default: 'Feedback'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  adminResponse: {
    type: String,
    default: ''
  },
  resolutionDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ComplaintFeedback', complaintFeedbackSchema);

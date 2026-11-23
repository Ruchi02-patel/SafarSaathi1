const mongoose = require('mongoose');

const vehicleDocumentSchema = new mongoose.Schema({
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
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    enum: ['RC Book', 'PUC', 'Insurance', 'Driving Licence', 'Fitness Certificate', 'Other']
  },
  documentName: {
    type: String,
    required: [true, 'Document name is required'],
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL / path is required']
  },
  filePath: {
    type: String
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Uploaded', 'Verified', 'Pending', 'Expired'],
    default: 'Uploaded'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VehicleDocument', vehicleDocumentSchema);

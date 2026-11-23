const path = require('path');
const fs = require('fs');
const { VehicleDocument, Vehicle } = require('../models');

// @desc    Get all documents for the authenticated user
// @route   GET /api/documents
exports.getUserDocuments = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.vehicleId) {
      filter.vehicleId = req.query.vehicleId;
    }
    const documents = await VehicleDocument.find(filter)
      .populate('vehicleId', 'vehicleNumber brand model')
      .sort({ uploadDate: -1 });

    res.json({
      success: true,
      count: documents.length,
      documents,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all documents for a specific vehicle
// @route   GET /api/documents/vehicle/:vehicleId
exports.getVehicleDocuments = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }
    if (vehicle.userId.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view documents for this vehicle.' });
    }
    const documents = await VehicleDocument.find({ vehicleId })
      .populate('vehicleId', 'vehicleNumber brand model')
      .sort({ uploadDate: -1 });
    res.json({
      success: true,
      count: documents.length,
      documents,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload / add a vehicle document
// @route   POST /api/documents/upload
exports.uploadDocument = async (req, res) => {
  try {
    const { vehicleId, documentType } = req.body;
    let documentName = (req.body.documentName || documentType || 'Official Document').trim();

    if (!vehicleId || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID and document type are required.'
      });
    }

    // Verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }
    if (vehicle.userId.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this vehicle.' });
    }

    let fileUrl = '';
    let filePath = '';

    const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (uploadedFile) {
      fileUrl = `/uploads/${uploadedFile.filename}`;
      filePath = uploadedFile.path;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
    } else {
      // Fallback default placeholder doc if uploaded without a file attachment
      fileUrl = `/uploads/default-document.pdf`;
    }

    const doc = await VehicleDocument.create({
      vehicleId,
      userId: req.user.id,
      documentType,
      documentName,
      fileUrl,
      filePath,
      status: 'Uploaded',
      uploadDate: new Date()
    });

    const populatedDoc = await VehicleDocument.findById(doc._id).populate('vehicleId', 'vehicleNumber brand model');

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully!',
      document: populatedDoc
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await VehicleDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Ensure document belongs to user or admin
    if (doc.userId && doc.userId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this document' });
    }

    // Attempt to unlink local file if exists
    if (doc.filePath && fs.existsSync(doc.filePath)) {
      try {
        fs.unlinkSync(doc.filePath);
      } catch (err) {
        console.warn('Could not remove file from disk:', err.message);
      }
    }

    await doc.deleteOne();

    res.json({
      success: true,
      message: 'Document deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

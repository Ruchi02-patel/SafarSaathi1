const { ComplaintFeedback } = require('../models');

// @desc    Get user's complaints and feedback
// @route   GET /api/complaints/my
exports.getMyComplaints = async (req, res) => {
  try {
    const items = await ComplaintFeedback.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: items.length,
      complaints: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit new complaint or feedback
// @route   POST /api/complaints
exports.submitComplaint = async (req, res) => {
  try {
    const { subject, message, type } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both subject and message.'
      });
    }

    const complaint = await ComplaintFeedback.create({
      userId: req.user.id,
      subject: subject.trim(),
      message: message.trim(),
      type: type || 'Feedback',
      status: 'Open'
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully. Our team will review it.',
      complaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all complaints & feedback
// @route   GET /api/complaints/admin/all
exports.getAllComplaintsAdmin = async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};
    if (type && type !== 'All') query.type = type;
    if (status && status !== 'All') query.status = status;

    const complaints = await ComplaintFeedback.find(query)
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Update complaint status & response
// @route   PUT /api/complaints/admin/:id/status
exports.updateComplaintStatusAdmin = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const complaint = await ComplaintFeedback.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    if (status) complaint.status = status;
    if (adminResponse !== undefined) complaint.adminResponse = adminResponse.trim();
    if (status === 'Resolved') complaint.resolutionDate = new Date();

    await complaint.save();

    res.json({
      success: true,
      message: 'Status updated successfully.',
      complaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

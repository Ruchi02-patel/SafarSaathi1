const { TrafficSign } = require('../models');

// @desc    Get all traffic signs with optional category filter & search
// @route   GET /api/traffic-signs
exports.getTrafficSigns = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const signs = await TrafficSign.find(query).sort({ category: 1, name: 1 });
    res.json({
      success: true,
      count: signs.length,
      signs,
      data: signs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single traffic sign by ID
// @route   GET /api/traffic-signs/:id
exports.getTrafficSignById = async (req, res) => {
  try {
    const sign = await TrafficSign.findById(req.params.id);
    if (!sign) {
      return res.status(404).json({ success: false, message: 'Traffic sign not found' });
    }
    res.json({ success: true, sign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const { Location } = require('../models');

// @desc    Get nearby locations (Mechanics, Petrol Pumps, RTO Offices)
// @route   GET /api/locations
exports.getLocations = async (req, res) => {
  try {
    const { type, city, search } = req.query;
    let query = { status: 'Active' };

    if (type && type !== 'All') {
      query.type = type;
    }

    if (city && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const locations = await Location.find(query).sort({ distanceKm: 1, rating: -1 });
    res.json({
      success: true,
      count: locations.length,
      locations,
      data: locations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }
    res.json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

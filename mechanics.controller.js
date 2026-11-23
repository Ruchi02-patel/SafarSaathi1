const { Mechanic } = require('../models');
const { isValidGujaratCity, normalizeGujaratCity } = require('../config/gujarat');

// @desc    Get all mechanics with optional search & filter
// @route   GET /api/mechanics
exports.getMechanics = async (req, res) => {
  try {
    const { search, city, specialization } = req.query;
    let query = { status: 'Active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    if (city && city !== 'All') {
      if (!isValidGujaratCity(city)) {
        return res.json({
          success: true,
          count: 0,
          mechanics: [],
          data: [],
          message: 'Selected city is not in the recognized Gujarat city list.'
        });
      }
      const canonicalCity = normalizeGujaratCity(city);
      query.city = new RegExp(`^${canonicalCity}$`, 'i');
    }

    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    const mechanics = await Mechanic.find(query).sort({ rating: -1, distanceKm: 1 });
    res.json({
      success: true,
      count: mechanics.length,
      mechanics,
      data: mechanics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single mechanic
// @route   GET /api/mechanics/:id
exports.getMechanicById = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) {
      return res.status(404).json({ success: false, message: 'Mechanic not found' });
    }
    res.json({
      success: true,
      mechanic
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add mechanic (Admin or seed)
// @route   POST /api/mechanics
exports.createMechanic = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.city && isValidGujaratCity(data.city)) {
      data.city = normalizeGujaratCity(data.city);
    }
    data.state = data.state || 'Gujarat';
    const mechanic = await Mechanic.create(data);
    res.status(201).json({ success: true, mechanic });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

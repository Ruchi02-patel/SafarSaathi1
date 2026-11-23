const { DrivingTeacher } = require('../models');
const { isValidGujaratCity, normalizeGujaratCity } = require('../config/gujarat');

// @desc    Get all driving teachers / instructors
// @route   GET /api/driving-teachers
exports.getDrivingTeachers = async (req, res) => {
  try {
    const { search, city, vehicleType } = req.query;
    let query = { status: 'Active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { vehicleType: { $regex: search, $options: 'i' } }
      ];
    }

    if (city && city !== 'All') {
      if (!isValidGujaratCity(city)) {
        return res.json({
          success: true,
          count: 0,
          instructors: [],
          teachers: [],
          data: [],
          message: 'Selected city is not in the recognized Gujarat city list.'
        });
      }
      const canonicalCity = normalizeGujaratCity(city);
      query.city = new RegExp(`^${canonicalCity}$`, 'i');
    }

    if (vehicleType && vehicleType !== 'All') {
      query.vehicleType = { $regex: vehicleType, $options: 'i' };
    }

    const instructors = await DrivingTeacher.find(query).sort({ rating: -1 });
    res.json({
      success: true,
      count: instructors.length,
      instructors,
      teachers: instructors,
      data: instructors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single driving teacher
// @route   GET /api/driving-teachers/:id
exports.getDrivingTeacherById = async (req, res) => {
  try {
    const instructor = await DrivingTeacher.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Driving instructor not found' });
    }
    res.json({
      success: true,
      instructor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add driving teacher (Admin/seed)
// @route   POST /api/driving-teachers
exports.createDrivingTeacher = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.city && isValidGujaratCity(data.city)) {
      data.city = normalizeGujaratCity(data.city);
    }
    data.state = data.state || 'Gujarat';
    const instructor = await DrivingTeacher.create(data);
    res.status(201).json({ success: true, instructor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const bcrypt = require('bcrypt');
const { User, Vehicle } = require('../models');

// ==========================================
// 1. Get Current Logged-in User Profile
// ==========================================
// GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    // Find user by ID from JWT token (exclude password field)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Count how many vehicles this user owns
    const vehicleCount = await Vehicle.countDocuments({ userId: user._id });

    res.json({
      success: true,
      user,
      vehicleCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. Update Current User Profile
// ==========================================
// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, city, state } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (address !== undefined) user.address = address.trim();
    if (city !== undefined) user.city = city.trim();
    if (state !== undefined) user.state = state.trim();

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. Change User Password
// ==========================================
// PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Step 1: Compare entered current password with hashed password in database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Step 2: Hash the new password with bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


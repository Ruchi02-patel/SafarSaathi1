const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'safarsaathi_mca_project_secret_key_2026';

// Helper to generate JWT Token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // Validations
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: full name, email, phone, and password.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { accountType, city, state, address } = req.body;
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      accountType: accountType === 'Business' ? 'Business' : 'Individual',
      city: city ? city.trim() : '',
      state: state ? state.trim() : '',
      address: address ? address.trim() : '',
      status: 'Active',
      role: 'User'
    });

    // Create Token
    const token = generateToken({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      accountType: user.accountType
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to SafarSaathi.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        address: user.address,
        accountType: user.accountType,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

// @desc    User Login
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    // Check if account is active
    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive or blocked. Please contact support.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    // Generate Token
    const token = generateToken({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role || 'User',
      accountType: user.accountType || 'Individual'
    });

    res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back to SafarSaathi!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        accountType: user.accountType || 'Individual',
        role: user.role || 'User',
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
};

// @desc    Admin Login
// @route   POST /api/auth/admin-login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both admin email and password.'
      });
    }

    // Find admin in Admin collection
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.'
      });
    }

    if (admin.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated.'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.'
      });
    }

    // Update lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role || 'Admin'
    });

    res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login.'
    });
  }
};

// @desc    Get Current Logged in User/Admin Profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    if (req.user.role === 'Admin' || req.user.role === 'Super Admin') {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found.' });
      }
      return res.json({ success: true, user: admin, isAdmin: true });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user, isAdmin: false });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile.' });
  }
};

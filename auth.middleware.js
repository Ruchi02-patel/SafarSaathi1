const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for authenticated users
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'safarsaathi_mca_project_secret_key_2026');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

// Middleware to restrict route access to Admin / Super Admin
const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Super Admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin
};

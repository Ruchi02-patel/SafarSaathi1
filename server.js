const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public folder (css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper to send HTML page
const sendPage = (pageName) => (req, res) => {
  res.sendFile(path.join(__dirname, 'public', pageName));
};

// ============================================
// FRONTEND WEB PAGE ROUTES (HTML5 + Vanilla JS)
// ============================================
// Public Pages
app.get('/', sendPage('index.html'));
app.get('/login', sendPage('login.html'));
app.get('/register', sendPage('register.html'));

// Citizen / User Portal Pages
app.get('/dashboard', sendPage('dashboard.html'));
app.get('/vehicles', sendPage('vehicles.html'));
app.get('/vehicles/add', sendPage('add-vehicle.html'));
app.get('/vehicles/details', sendPage('vehicle-details.html'));
app.get('/fuel', sendPage('fuel.html'));
app.get('/documents', sendPage('documents.html'));
app.get('/insurance', sendPage('insurance.html'));
app.get('/expenses', sendPage('expenses.html'));
app.get('/services', sendPage('services.html'));
app.get('/mechanics', sendPage('mechanics.html'));
app.get('/nearby-places', sendPage('nearby-places.html'));
app.get('/driving-teachers', sendPage('driving-teachers.html'));
app.get('/traffic-signs', sendPage('traffic-signs.html'));
app.get('/vehicle-calculator', sendPage('vehicle-calculator.html'));
app.get('/vehicle-search', sendPage('vehicle-search.html'));
app.get('/notifications', sendPage('notifications.html'));
app.get('/complaints', sendPage('complaints.html'));
app.get('/profile', sendPage('profile.html'));

// Administrator Console Pages
app.get('/admin/login', sendPage('admin-login.html'));
app.get('/admin/dashboard', sendPage('admin-dashboard.html'));
app.get('/admin/users', sendPage('admin-users.html'));
app.get('/admin/vehicles', sendPage('admin-vehicles.html'));
app.get('/admin/services', sendPage('admin-services.html'));
app.get('/admin/loans', sendPage('admin-loans.html'));
app.get('/admin/complaints', sendPage('admin-complaints.html'));
app.get('/admin/reports', sendPage('admin-reports.html'));

// ============================================
// REST API ROUTES
// ============================================
app.use('/api/health', require('./routes/health.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/vehicles', require('./routes/vehicles.routes'));
app.use('/api/documents', require('./routes/documents.routes'));
app.use('/api/fuel', require('./routes/fuel.routes'));
app.use('/api/insurance', require('./routes/insurance.routes'));
app.use('/api/loans', require('./routes/loans.routes'));
app.use('/api/mechanics', require('./routes/mechanics.routes'));
app.use('/api/driving-teachers', require('./routes/driving-teachers.routes'));
app.use('/api/locations', require('./routes/locations.routes'));
app.use('/api/traffic-signs', require('./routes/traffic-signs.routes'));
app.use('/api/expenses', require('./routes/expenses.routes'));
app.use('/api/services', require('./routes/services.routes'));
app.use('/api/notifications', require('./routes/notifications.routes'));
app.use('/api/complaints', require('./routes/complaints.routes'));
app.use('/api/vehicle-search', require('./routes/vehicle-search.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 404 Route Handler
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `API Route not found: ${req.method} ${req.originalUrl}`
    });
  }
  // Redirect unknown frontend routes to home or send landing page
  res.redirect('/');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SafarSaathi Web Server running on http://localhost:${PORT}`);
});

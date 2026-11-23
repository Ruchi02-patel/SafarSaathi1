const mongoose = require('mongoose');

// Controller to check server and MongoDB status
const getHealthStatus = (req, res) => {
  const dbStates = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.status(200).json({
    success: true,
    project: 'SafarSaathi API',
    message: 'SafarSaathi Express Backend is running!',
    database: {
      status: dbStates[mongoose.connection.readyState] || 'Unknown',
      name: mongoose.connection.name || 'safarsaathi',
      host: mongoose.connection.host || '127.0.0.1'
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let embeddedServer = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/safarsaathi';

  try {
    // 1. Try connecting to local MongoDB service (mongodb://127.0.0.1:27017/safarsaathi)
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (initialError) {
    console.log('Local MongoDB service not detected on port 27017. Starting embedded MongoDB server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbPath = path.join(__dirname, '..', '.mongodb-data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      embeddedServer = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          ip: '127.0.0.1',
          dbName: 'safarsaathi',
          dbPath: dbPath,
          storageEngine: 'wiredTiger'
        }
      });

      const fallbackUri = embeddedServer.getUri('safarsaathi');
      const conn = await mongoose.connect(fallbackUri);
      console.log(`MongoDB Connected Successfully (Embedded Local Server): ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
      return conn;
    } catch (fallbackError) {
      console.error('MongoDB Connection Error:', fallbackError.message);
    }
  }
};

module.exports = connectDB;

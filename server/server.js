const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin@127.0.0.1:27017/profiledb?authSource=admin';

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Express] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

  res.json({
    status: 'OK',
    service: 'profile-backend',
    timestamp: new Date().toISOString(),
    database: {
      status: states[mongoState] || 'Unknown',
      connected: mongoState === 1,
      uri: MONGO_URI.replace(/\/\/[^@]*@/, '//***@'),
    },
    system: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
    },
  });
});

// Mount Routes
app.use('/api/profiles', profileRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Profile Backend API is running!',
    endpoints: {
      health: '/health',
      profiles: '/api/profiles',
      seed: 'POST /api/profiles/seed',
    },
  });
});

// MongoDB connection with automatic retry
const connectWithRetry = async () => {
  console.log(`[MongoDB] Connecting to: ${MONGO_URI}`);
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ [MongoDB] Connected to database successfully!');
  } catch (err) {
    console.error(`❌ [MongoDB] Connection error: ${err.message}`);
    console.log('🔄 [MongoDB] Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 Backend running on http://0.0.0.0:${PORT}`);
  console.log(`===============================================`);
});

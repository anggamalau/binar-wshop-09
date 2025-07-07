const path = require('path');
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env file at:', envPath);
require('dotenv').config({ path: envPath });

// Debug: Log environment loading
console.log('Environment variables loaded:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '***loaded***' : 'NOT LOADED');

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const { initializeDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: false // Not needed for JWT
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      if (process.env.DEBUG === 'true') {
        console.log('Debug mode enabled');
        console.log(`CORS origin: ${process.env.CORS_ORIGIN}`);
        console.log(`Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS} requests per ${process.env.RATE_LIMIT_WINDOW_MS}ms`);
      }
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON request bodies
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'TaskFlow REST API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server after verifying database connection
const startServer = async () => {
  try {
    // Attempt database auto-initialization
    try {
      await initializeDatabase();
    } catch (dbErr) {
      console.warn('[DB Warning] Could not auto-initialize MySQL schema immediately:', dbErr.message);
      console.warn('[DB Warning] Ensure MySQL is running on', process.env.DB_HOST || '127.0.0.1', 'port', process.env.DB_PORT || 3306);
    }

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 TaskFlow Backend Server running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();

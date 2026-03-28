require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

// Import routes
const chatRoutes = require('./routes/chat.routes.js');
const diseaseRoutes = require('./routes/cropDisease.routes.js');
const fertilizerRoutes = require('./routes/fertilizerRoutes');
const historyRoutes = require('./routes/historyRoutes');
const dashboardRoutes = require('./routes/dashboard.routes');
const newsRoutes = require('./routes/news.routes');
const authRoutes = require('./routes/auth.routes.js');
const profileRoutes = require('./routes/profile.routes.js');
const adminRoutes = require('./routes/admin.routes');
const pestRoutes = require('./routes/pest.routes.js');
const { apiLimiter, groqLimiter } = require('./middleware/rateLimiter');



const app = express();
const PORT = process.env.PORT || 3000;

//cookie middleware 
app.use(cookieParser());

// Middleware
// app.use(cors());
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite
    'http://localhost:5174', // Vite alternate port
    // 'http://localhost:3000', // CRA / fallback
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
// Connect to MongoDB
connectDB();



app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiter to all API routes
app.use('/api', apiLimiter);


// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
  app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    app: 'KhetiBuddy'
  });
});


// API Routes
app.use('/api/chat', groqLimiter, chatRoutes);
app.use('/api/crop-disease', groqLimiter, diseaseRoutes);
app.use('/api/fertilizer', fertilizerRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/me', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pest', pestRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ KhetiBuddy Backend Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Routes
const foodRoutes = require('./routes/foodRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Allow all localhost requests
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Reject all other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize demo user on startup
function initializeDemoUser() {
  const checkUserQuery = 'SELECT COUNT(*) as count FROM users';
  db.query(checkUserQuery, (err, result) => {
    if (err) {
      console.error('Error checking users:', err.message);
      return;
    }
    
    if (result[0].count === 0) {
      const insertUserQuery = 'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)';
      db.query(insertUserQuery, ['Demo User', 'demo@carimakan.com', 'password123'], (err, result) => {
        if (err) {
          console.error('Error creating demo user:', err.message);
        } else {
          console.log('✓ Demo user created (ID: 1)');
        }
      });
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✓ CariMakan API Server Running`);
  console.log(`✓ Port: ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`${'='.repeat(50)}\n`);
  
  // Initialize demo user if needed
  setTimeout(initializeDemoUser, 1000);
});
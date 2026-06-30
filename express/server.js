require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

// Routes
const foodRoutes = require('./routes/foodRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

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
      console.warn('Database unavailable during demo user initialization; continuing in fallback mode.');
      return;
    }

    Promise.all([
      bcrypt.hash('password123', 8),
      bcrypt.hash('admin123', 8)
    ])
      .then(([demoHash, adminHash]) => {
        const seedUsers = [
          {
            nama: 'Demo User',
            username: 'demo',
            email: 'demo@carimakan.com',
            password: demoHash,
            role_id: 2,
            is_active: 1
          },
          {
            nama: 'Admin User',
            username: 'admin',
            email: 'admin@carimakan.com',
            password: adminHash,
            role_id: 1,
            is_active: 1
          }
        ];

        const createOrUpdateUser = (user) => new Promise((resolve) => {
          const query = 'SELECT user_id FROM users WHERE email = ? OR username = ?';
          db.query(query, [user.email, user.username], (selectErr, existingUsers) => {
            if (selectErr) {
              resolve();
              return;
            }

            if (existingUsers && existingUsers.length > 0) {
              const existingUser = existingUsers[0];
              db.query(
                'UPDATE users SET nama = ?, username = ?, email = ?, password = ?, role_id = ?, is_active = ? WHERE user_id = ?',
                [user.nama, user.username, user.email, user.password, user.role_id, user.is_active, existingUser.user_id],
                (updateErr) => {
                  if (updateErr) {
                    console.warn('User update skipped:', updateErr.message);
                  }
                  resolve();
                }
              );
            } else {
              db.query(
                'INSERT INTO users (nama, username, email, password, role_id, is_active) VALUES (?, ?, ?, ?, ?, ?)',
                [user.nama, user.username, user.email, user.password, user.role_id, user.is_active],
                (insertErr) => {
                  if (insertErr) {
                    console.warn('User insert skipped:', insertErr.message);
                  }
                  resolve();
                }
              );
            }
          });
        });

        Promise.all(seedUsers.map(createOrUpdateUser))
          .then(() => {
            const hasUsers = (result && result[0]?.count) || 0;
            if (hasUsers === 0) {
              console.log('✓ Demo users created (demo / admin)');
            } else {
              console.log('✓ Demo users verified (demo / admin)');
            }
          });
      })
      .catch((hashErr) => {
        console.warn('Demo users creation skipped:', hashErr.message);
      });
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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);

// Simple database status endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    success: true,
    connected: false,
    message: 'Database connection is not available in the current environment. Please verify MySQL credentials.'
  });
});

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
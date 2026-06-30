const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'carimakan_db',
  port: process.env.DB_PORT || 3306
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    console.error('Falling back to default local MySQL settings if available...');
  } else {
    console.log('✓ Database connected successfully');
  }
});

module.exports = db;

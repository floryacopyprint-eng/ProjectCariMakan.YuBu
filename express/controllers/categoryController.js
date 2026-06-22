const db = require('../config/db');
const { formatCategories } = require('../config/responseFormatter');

// GET /api/categories - Get all categories
exports.getAllCategories = (req, res) => {
  try {
    const query = 'SELECT category_id as id, nama_kategori as name, deskripsi as description FROM categories';
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      res.json({
        success: true,
        data: formatCategories(result),
        total: result.length
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

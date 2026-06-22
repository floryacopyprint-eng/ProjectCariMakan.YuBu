const db = require('../config/db');
const { formatReviews } = require('../config/responseFormatter');

// GET /api/reviews/:foodId - Get reviews by food
exports.getReviewsByFood = (req, res) => {
  try {
    const { foodId } = req.params;
    const query = 'SELECT * FROM reviews WHERE food_id = ? ORDER BY created_at DESC';
    db.query(query, [foodId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      res.json({
        success: true,
        data: formatReviews(result),
        total: result.length
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// POST /api/reviews - Create review
exports.createReview = (req, res) => {
  try {
    const { user_id, food_id, rating, comment } = req.body;

    if (!user_id || !food_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO reviews (user_id, food_id, rating, komentar, created_at) VALUES (?, ?, ?, ?, NOW())';
    db.query(query, [user_id, food_id, rating, comment || ''], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        id: result.insertId
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

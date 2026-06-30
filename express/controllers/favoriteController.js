const db = require('../config/db');
const { formatFavorites } = require('../config/responseFormatter');

// GET /api/favorites/:userId - Get favorites by user
exports.getFavoritesByUser = (req, res) => {
  try {
    const authenticatedUserId = req.user?.user_id;
    const { userId } = req.params;

    if (!authenticatedUserId) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    if (String(userId) !== String(authenticatedUserId)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }

    const query = `
      SELECT f.*, c.nama_kategori as category_name 
      FROM favorites fav
      JOIN foods f ON fav.food_id = f.food_id
      LEFT JOIN categories c ON f.category_id = c.category_id
      WHERE fav.user_id = ?
      ORDER BY fav.created_at DESC
    `;
    db.query(query, [authenticatedUserId], (err, result) => {
      if (err) {
        console.error('Favorites query failed:', err.message);
        return res.status(500).json({ error: 'Database error', message: 'Unable to load favorites right now. Please verify MySQL access.' });
      }
      res.json({
        success: true,
        data: formatFavorites(result),
        total: result.length
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// POST /api/favorites - Add to favorites
exports.addFavorite = (req, res) => {
  try {
    const authenticatedUserId = req.user?.user_id;
    const { user_id, food_id } = req.body;

    if (!authenticatedUserId) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    if (!food_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const targetUserId = user_id || authenticatedUserId;
    if (String(targetUserId) !== String(authenticatedUserId)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }

    // Check if already favorited
    const checkQuery = 'SELECT * FROM favorites WHERE user_id = ? AND food_id = ?';
    db.query(checkQuery, [authenticatedUserId, food_id], (checkErr, checkResult) => {
      if (checkErr) {
        return res.status(500).json({ error: 'Database error', message: checkErr.message });
      }

      if (checkResult.length > 0) {
        return res.status(400).json({ error: 'Already added to favorites' });
      }

      const query = 'INSERT INTO favorites (user_id, food_id, created_at) VALUES (?, ?, NOW())';
      db.query(query, [authenticatedUserId, food_id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', message: err.message });
        }
        res.status(201).json({
          success: true,
          message: 'Added to favorites',
          id: result.insertId
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// DELETE /api/favorites/:userId/:foodId - Remove from favorites
exports.removeFavorite = (req, res) => {
  try {
    const authenticatedUserId = req.user?.user_id;
    const { userId, foodId } = req.params;

    if (!authenticatedUserId) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    if (String(userId) !== String(authenticatedUserId)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }

    const query = 'DELETE FROM favorites WHERE user_id = ? AND food_id = ?';
    db.query(query, [authenticatedUserId, foodId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Favorite not found' });
      }
      res.json({
        success: true,
        message: 'Removed from favorites'
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

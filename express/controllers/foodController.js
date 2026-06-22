const db = require('../config/db');
const { formatFood, formatFoods } = require('../config/responseFormatter');

// GET /api/foods - Get all foods
exports.getAllFoods = (req, res) => {
  try {
    const query = 'SELECT * FROM foods';
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      res.json({
        success: true,
        data: formatFoods(result),
        total: result.length
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// GET /api/foods/:id - Get food detail
exports.getFoodById = (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM foods WHERE food_id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Food not found' });
      }
      res.json({
        success: true,
        data: formatFood(result[0])
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// POST /api/foods - Create new food
exports.createFood = (req, res) => {
  try {
    const { name, description, price, image, category_id, rating } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO foods (nama_makanan, deskripsi, harga, gambar, category_id, rating, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
    db.query(query, [name, description, price, image, category_id, rating || 0], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      res.status(201).json({
        success: true,
        message: 'Food created successfully',
        id: result.insertId
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// PUT /api/foods/:id - Update food
exports.updateFood = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category_id, rating } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'UPDATE foods SET nama_makanan = ?, deskripsi = ?, harga = ?, gambar = ?, category_id = ?, rating = ? WHERE food_id = ?';
    db.query(query, [name, description, price, image, category_id, rating || 0, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Food not found' });
      }
      res.json({
        success: true,
        message: 'Food updated successfully'
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// DELETE /api/foods/:id - Delete food
exports.deleteFood = (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM foods WHERE food_id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Food not found' });
      }
      res.json({
        success: true,
        message: 'Food deleted successfully'
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

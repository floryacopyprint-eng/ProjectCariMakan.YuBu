const db = require('../config/db');

// =====================
// MAKANAN CRUD
// =====================

// GET semua makanan
const getFoods = (req, res) => {
  db.query('SELECT * FROM foods ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching foods',
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      data: results
    });
  });
};

// GET detail makanan
const getFoodById = (req, res) => {
  const foodId = req.params.id;

  db.query('SELECT * FROM foods WHERE food_id = ?', [foodId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching food'
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: results[0]
    });
  });
};

// POST tambah makanan
const createFood = (req, res) => {
  const { category_id, nama_makanan, deskripsi, harga, gambar, asal_daerah } = req.body;

  if (!nama_makanan || !harga) {
    return res.status(400).json({
      success: false,
      message: 'Nama makanan dan harga wajib diisi'
    });
  }

  db.query(
    'INSERT INTO foods SET ?',
    {
      category_id,
      nama_makanan,
      deskripsi,
      harga,
      gambar,
      asal_daerah,
      is_active: 1
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error creating food',
          error: err.message
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Food created successfully',
        data: { food_id: result.insertId }
      });
    }
  );
};

// PUT update makanan
const updateFood = (req, res) => {
  const foodId = req.params.id;
  const { category_id, nama_makanan, deskripsi, harga, gambar, asal_daerah, alamat_resto, is_active } = req.body;

  // Ambil data lama dulu agar is_active tidak hilang saat update
  db.query('SELECT is_active FROM foods WHERE food_id = ?', [foodId], (selectErr, existing) => {
    if (selectErr || !existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    const currentIsActive = existing[0].is_active;
    const newIsActive = is_active !== undefined ? (is_active ? 1 : 0) : currentIsActive;

    db.query(
      'UPDATE foods SET ? WHERE food_id = ?',
      [{ category_id, nama_makanan, deskripsi, harga, gambar, asal_daerah, alamat_resto, is_active: newIsActive }, foodId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error updating food', error: err.message });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Food not found' });
        }
        return res.status(200).json({ success: true, message: 'Food updated successfully' });
      }
    );
  });
};

// PATCH toggle status aktif/nonaktif makanan
const toggleFoodStatus = (req, res) => {
  const foodId = req.params.id;

  db.query('SELECT is_active FROM foods WHERE food_id = ?', [foodId], (err, results) => {
    if (err || !results || results.length === 0) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    const newStatus = results[0].is_active ? 0 : 1;

    db.query('UPDATE foods SET is_active = ? WHERE food_id = ?', [newStatus, foodId], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ success: false, message: 'Error toggling food status' });
      }
      return res.status(200).json({
        success: true,
        message: `Makanan berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
        is_active: newStatus
      });
    });
  });
};

// DELETE makanan
const deleteFood = (req, res) => {
  const foodId = req.params.id;

  db.query('DELETE FROM foods WHERE food_id = ?', [foodId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting food',
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Food deleted successfully'
    });
  });
};

// =====================
// USER MANAGEMENT
// =====================

// GET semua user
const getUsers = (req, res) => {
  const query = `
    SELECT 
      u.user_id, 
      u.nama, 
      u.username, 
      u.email, 
      u.role_id, 
      r.nama_role,
      u.is_active, 
      u.foto_profil,
      u.created_at 
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.role_id
    ORDER BY u.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      data: results
    });
  });
};

// PUT update profile user (admin only)
const updateUserProfile = (req, res) => {
  const userId = req.params.id;
  const { nama, username, email, foto_profil } = req.body;

  if (!nama || !username || !email) {
    return res.status(400).json({
      success: false,
      message: 'Nama, username, dan email wajib diisi'
    });
  }

  const normalizedUsername = String(username).trim();
  const normalizedEmail = String(email).trim().toLowerCase();

  const checkQuery = 'SELECT user_id FROM users WHERE (username = ? OR email = ?) AND user_id != ?';
  db.query(checkQuery, [normalizedUsername, normalizedEmail, userId], (checkErr, existingUsers) => {
    if (checkErr) {
      return res.status(500).json({
        success: false,
        message: 'Error validating profile data',
        error: checkErr.message
      });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username atau email sudah digunakan oleh user lain'
      });
    }

    const updateQuery = 'UPDATE users SET nama = ?, username = ?, email = ?, foto_profil = ? WHERE user_id = ?';
    db.query(updateQuery, [String(nama).trim(), normalizedUsername, normalizedEmail, foto_profil || null, userId], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error updating user profile',
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User profile updated successfully'
      });
    });
  });
};

// PUT update status user
const updateUserStatus = (req, res) => {
  const userId = req.params.id;
  const { is_active } = req.body;

  if (is_active === undefined) {
    return res.status(400).json({
      success: false,
      message: 'is_active field wajib diisi'
    });
  }

  db.query(
    'UPDATE users SET is_active = ? WHERE user_id = ?',
    [is_active ? 1 : 0, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error updating user status',
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User status updated successfully'
      });
    }
  );
};

// PUT update role user
const updateUserRole = (req, res) => {
  const userId = req.params.id;
  const { role_id } = req.body;

  if (!role_id || (role_id !== 1 && role_id !== 2)) {
    return res.status(400).json({
      success: false,
      message: 'role_id harus 1 (admin) atau 2 (user)'
    });
  }

  // Jangan ubah role user dengan ID 1 (super admin)
  if (userId === '1') {
    return res.status(403).json({
      success: false,
      message: 'Tidak bisa mengubah role super admin'
    });
  }

  db.query(
    'UPDATE users SET role_id = ? WHERE user_id = ?',
    [role_id, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error updating user role',
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User role updated successfully'
      });
    }
  );
};

// =====================
// ORDERS MANAGEMENT
// =====================

// GET semua order
const getOrders = (req, res) => {
  const query = `
    SELECT 
      o.order_id, 
      u.nama, 
      u.username,
      o.total_harga, 
      o.status, 
      o.created_at,
      COUNT(od.detail_id) as item_count
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    LEFT JOIN order_details od ON o.order_id = od.order_id
    GROUP BY o.order_id
    ORDER BY o.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching orders',
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      data: results
    });
  });
};

// PUT update status order
const updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status tidak valid'
    });
  }

  db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error updating order status',
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully'
    });
  });
};

// =====================
// DASHBOARD STATISTICS
// =====================

// GET dashboard stats
const getDashboard = (req, res) => {
  const queries = {
    users: 'SELECT COUNT(*) as total FROM users WHERE role_id = 2',
    foods: 'SELECT COUNT(*) as total FROM foods WHERE is_active = 1',
    orders: 'SELECT COUNT(*) as total FROM orders',
    favorites: 'SELECT COUNT(*) as total FROM favorites'
  };

  let stats = {};
  let completed = 0;

  // Query users
  db.query(queries.users, (err, results) => {
    if (!err && results.length > 0) {
      stats.totalUsers = results[0].total;
    }
    completed++;
    checkComplete();
  });

  // Query foods
  db.query(queries.foods, (err, results) => {
    if (!err && results.length > 0) {
      stats.totalFoods = results[0].total;
    }
    completed++;
    checkComplete();
  });

  // Query orders
  db.query(queries.orders, (err, results) => {
    if (!err && results.length > 0) {
      stats.totalOrders = results[0].total;
    }
    completed++;
    checkComplete();
  });

  // Query favorites
  db.query(queries.favorites, (err, results) => {
    if (!err && results.length > 0) {
      stats.totalFavorites = results[0].total;
    }
    completed++;
    checkComplete();
  });

  const checkComplete = () => {
    if (completed === 4) {
      return res.status(200).json({
        success: true,
        data: {
          totalUsers: stats.totalUsers || 0,
          totalFoods: stats.totalFoods || 0,
          totalOrders: stats.totalOrders || 0,
          totalFavorites: stats.totalFavorites || 0
        }
      });
    }
  };
};

module.exports = {
  // Foods
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  toggleFoodStatus,
  deleteFood,
  // Users
  getUsers,
  updateUserProfile,
  updateUserStatus,
  updateUserRole,
  // Orders
  getOrders,
  updateOrderStatus,
  // Dashboard
  getDashboard
};

const db = require('../config/db');
const { formatOrders } = require('../config/responseFormatter');

// GET /api/orders/:userId - Get orders by user
exports.getOrdersByUser = (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT o.*, 
             COUNT(od.detail_id) as item_count,
             GROUP_CONCAT(CONCAT(f.nama_makanan, ' x', od.jumlah) SEPARATOR ', ') as items
      FROM orders o
      LEFT JOIN order_details od ON o.order_id = od.order_id
      LEFT JOIN foods f ON od.food_id = f.food_id
      WHERE o.user_id = ?
      GROUP BY o.order_id
      ORDER BY o.created_at DESC
    `;
    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', message: err.message });
      }
      res.json({
        success: true,
        data: formatOrders(result),
        total: result.length
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// POST /api/orders - Create new order
exports.createOrder = (req, res) => {
  try {
    const { user_id, items, total_price, status } = req.body;

    if (!user_id || !items || items.length === 0 || total_price === undefined || total_price === null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderQuery = 'INSERT INTO orders (user_id, total_harga, status, created_at) VALUES (?, ?, ?, NOW())';
    db.query(orderQuery, [user_id, total_price, status || 'pending'], (orderErr, orderResult) => {
      if (orderErr) {
        return res.status(500).json({ error: 'Database error', message: orderErr.message });
      }

      const orderId = orderResult.insertId;
      const detailQuery = 'INSERT INTO order_details (order_id, food_id, jumlah, harga_satuan) VALUES (?, ?, ?, ?)';

      const insertDetails = items.map(item => {
        return new Promise((resolve, reject) => {
          db.query(detailQuery, [orderId, item.food_id, item.quantity, item.price], (detailErr) => {
            if (detailErr) {
              reject(detailErr);
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(insertDetails)
        .then(() => {
          res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId: orderId
          });
        })
        .catch((detailErr) => {
          console.error('Error inserting order detail:', detailErr);
          res.status(500).json({
            error: 'Database error',
            message: detailErr.message
          });
        });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

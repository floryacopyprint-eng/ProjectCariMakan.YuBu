const db = require('../config/db');
const { formatOrders } = require('../config/responseFormatter');

const fallbackOrders = [];

const normalizeOrderStatus = (status) => {
  if (!status) return 'pending';
  const normalized = String(status).trim().toLowerCase();
  if (normalized === 'menunggu verifikasi pembayaran' || normalized === 'pending') return 'pending';
  if (normalized === 'diproses' || normalized === 'processing') return 'diproses';
  if (normalized === 'dikirim' || normalized === 'shipped') return 'dikirim';
  if (normalized === 'selesai' || normalized === 'completed') return 'selesai';
  if (normalized === 'dibatalkan' || normalized === 'cancelled') return 'dibatalkan';
  return normalized;
};

const toApiOrder = (order) => ({
  order_id: order.order_id,
  id: order.order_id,
  user_id: order.user_id,
  total_harga: order.total_harga,
  total_price: order.total_harga,
  status: normalizeOrderStatus(order.status),
  items: order.items || [],
  item_count: Array.isArray(order.items) ? order.items.length : order.item_count || 0,
  created_at: order.created_at || new Date().toISOString(),
  address: order.address || order.alamat_pengiriman,
  alamat_pengiriman: order.address || order.alamat_pengiriman,
  notes: order.notes || order.catatan,
  catatan: order.notes || order.catatan,
  paymentMethod: order.paymentMethod || order.payment_method,
  payment_method: order.paymentMethod || order.payment_method,
  customer: order.customer,
  phone: order.phone
});

const getFallbackOrdersByUser = (userId) => {
  return fallbackOrders
    .filter((order) => String(order.user_id) === String(userId))
    .map(toApiOrder)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const getFallbackOrderById = (orderId) => {
  const found = fallbackOrders.find((order) => String(order.order_id) === String(orderId));
  return found ? toApiOrder(found) : null;
};

// GET /api/orders/:userId - Get orders by user
exports.getOrdersByUser = (req, res) => {
  try {
    const authenticatedUserId = req.user?.user_id;
    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const requestedUserId = req.params.userId;
    if (requestedUserId && String(requestedUserId) !== String(authenticatedUserId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

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
    db.query(query, [authenticatedUserId], (err, result) => {
      if (err) {
        console.error('Orders query failed:', err.message);
        const fallbackData = getFallbackOrdersByUser(authenticatedUserId);
        return res.json({
          success: true,
          data: fallbackData,
          total: fallbackData.length
        });
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
    const authenticatedUserId = req.user?.user_id;
    const {
      items,
      total_price,
      status,
      customer,
      phone,
      address,
      notes,
      paymentMethod,
      subtotal,
      shippingCost,
      total
    } = req.body;

    if (!authenticatedUserId) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!customer || !phone || !address || !paymentMethod) {
      return res.status(400).json({ message: 'Nama, nomor HP, alamat, dan metode pembayaran wajib diisi.' });
    }

    const normalizedStatus = status === 'Menunggu Verifikasi Pembayaran' || status === 'pending'
      ? 'pending'
      : (status || 'pending');
    const targetUserId = authenticatedUserId;

    const orderQuery = `
      INSERT INTO orders (
        user_id,
        total_harga,
        status,
        alamat_pengiriman,
        catatan,
        created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())
    `;
    db.query(orderQuery, [targetUserId, total || total_price, normalizedStatus, address, notes || null], (orderErr, orderResult) => {
      if (orderErr) {
        console.error('Create order failed:', orderErr.message);

        const fallbackOrder = {
          order_id: Date.now(),
          user_id: targetUserId,
          total_harga: total || total_price,
          status: normalizedStatus,
          address,
          alamat_pengiriman: address,
          notes: notes || null,
          catatan: notes || null,
          paymentMethod,
          payment_method: paymentMethod,
          customer,
          phone,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal
          })),
          created_at: new Date().toISOString()
        };
        fallbackOrders.unshift(fallbackOrder);

        return res.status(201).json({
          success: true,
          message: 'Order created successfully using fallback storage',
          orderId: fallbackOrder.order_id
        });
      }

      const orderId = orderResult.insertId;
      const detailQuery = 'INSERT INTO order_details (order_id, food_id, jumlah, harga_satuan) VALUES (?, ?, ?, ?)';

      const insertDetails = items.map(item => {
        return new Promise((resolve, reject) => {
          const foodId = item.productId || item.food_id || item.id;
          db.query(detailQuery, [orderId, foodId, item.quantity, item.price], (detailErr) => {
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

// GET /api/orders - Get all orders
exports.getAllOrders = (req, res) => {
  try {
    const query = `
      SELECT o.*, 
             COUNT(od.detail_id) as item_count,
             GROUP_CONCAT(CONCAT(f.nama_makanan, ' x', od.jumlah) SEPARATOR ', ') as items
      FROM orders o
      LEFT JOIN order_details od ON o.order_id = od.order_id
      LEFT JOIN foods f ON od.food_id = f.food_id
      GROUP BY o.order_id
      ORDER BY o.created_at DESC
    `;
    db.query(query, (err, result) => {
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

// GET /api/orders/:id - Get order detail
exports.getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT o.*, 
             COUNT(od.detail_id) as item_count,
             GROUP_CONCAT(CONCAT(f.nama_makanan, ' x', od.jumlah) SEPARATOR ', ') as items
      FROM orders o
      LEFT JOIN order_details od ON o.order_id = od.order_id
      LEFT JOIN foods f ON od.food_id = f.food_id
      WHERE o.order_id = ?
      GROUP BY o.order_id
    `;
    db.query(query, [id], (err, result) => {
      if (err) {
        const fallbackOrder = getFallbackOrderById(id);
        if (!fallbackOrder) {
          return res.status(404).json({ error: 'Order not found' });
        }
        return res.json({ success: true, data: fallbackOrder });
      }
      if (result.length === 0) {
        const fallbackOrder = getFallbackOrderById(id);
        if (!fallbackOrder) {
          return res.status(404).json({ error: 'Order not found' });
        }
        return res.json({ success: true, data: fallbackOrder });
      }
      res.json({ success: true, data: formatOrders(result)[0] });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// PUT /api/orders/:id/status - Update order status
exports.updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const acceptedStatuses = ['Menunggu Verifikasi Pembayaran', 'Diproses', 'Dikemas', 'Dikirim', 'Selesai', 'Dibatalkan', 'pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];
    if (!acceptedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const normalizedStatus = status === 'Menunggu Verifikasi Pembayaran' || status === 'pending'
      ? 'pending'
      : (status === 'Diproses' || status === 'diproses' ? 'diproses' : (status === 'Dikirim' || status === 'dikirim' ? 'dikirim' : (status === 'Selesai' || status === 'selesai' ? 'selesai' : 'dibatalkan')));

    db.query('UPDATE orders SET status = ? WHERE order_id = ?', [normalizedStatus, id], (err, result) => {
      if (err) {
        const existingOrder = fallbackOrders.find((order) => String(order.order_id) === String(id));
        if (!existingOrder) {
          return res.status(404).json({ error: 'Order not found' });
        }
        existingOrder.status = normalizedStatus;
        return res.json({ success: true, message: 'Order status updated successfully in fallback storage' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ success: true, message: 'Order status updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

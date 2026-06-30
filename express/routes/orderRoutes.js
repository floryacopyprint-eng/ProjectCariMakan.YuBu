const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Order endpoints
router.get('/', orderController.getAllOrders);
router.get('/user/:userId', authMiddleware, orderController.getOrdersByUser);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);
router.post('/', authMiddleware, orderController.createOrder);

module.exports = router;

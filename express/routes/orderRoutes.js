const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Order endpoints
router.get('/:userId', orderController.getOrdersByUser);
router.post('/', orderController.createOrder);

module.exports = router;

const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Semua route admin memerlukan authMiddleware dan adminMiddleware
router.use(authMiddleware, adminMiddleware);

// =====================
// DASHBOARD
// =====================
router.get('/dashboard', adminController.getDashboard);

// =====================
// FOODS CRUD
// =====================
router.get('/foods', adminController.getFoods);
router.get('/foods/:id', adminController.getFoodById);
router.post('/foods', adminController.createFood);
router.put('/foods/:id', adminController.updateFood);
router.patch('/foods/:id/toggle-status', adminController.toggleFoodStatus);
router.delete('/foods/:id', adminController.deleteFood);

// =====================
// USER MANAGEMENT
// =====================
router.get('/users', adminController.getUsers);
router.put('/users/:id/profile', adminController.updateUserProfile);
router.put('/users/:id/status', adminController.updateUserStatus);
router.put('/users/:id/role', adminController.updateUserRole);

// =====================
// ORDERS
// =====================
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Favorite endpoints
router.get('/:userId', favoriteController.getFavoritesByUser);
router.post('/', favoriteController.addFavorite);
router.delete('/:userId/:foodId', favoriteController.removeFavorite);

module.exports = router;

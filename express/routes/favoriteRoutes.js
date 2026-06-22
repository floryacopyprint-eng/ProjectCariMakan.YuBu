const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Favorite endpoints
router.get('/:userId', favoriteController.getFavoritesByUser);
router.post('/', favoriteController.addFavorite);
router.delete('/:userId/:foodId', favoriteController.removeFavorite);

module.exports = router;

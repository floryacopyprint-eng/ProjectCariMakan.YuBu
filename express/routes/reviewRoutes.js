const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Review endpoints
router.get('/:foodId', reviewController.getReviewsByFood);
router.post('/', reviewController.createReview);

module.exports = router;

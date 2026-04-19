const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// @route POST /api/likes/add
// @desc Add a like for a product by a user
// @access Public
router.post('/add', likeController.addLike);

// @route DELETE /api/likes/remove
// @desc Remove a like for a product by a user
// @access Public
router.delete('/remove', likeController.removeLike);

// @route GET /api/likes
// @desc Get all likes (optionally filter by userId or productId)
// @access Public
router.get('/', likeController.getLikes);

// @route GET /api/likes/count
// @desc Get the number of likes for each product
// @access Public
router.get('/count', likeController.getLikeCounts);

// @route GET /api/likes/liked-products
// @desc Get all products that have at least one like, along with the users who liked them
// @access Public
router.get('/liked-products', likeController.getLikedProducts);

module.exports = router;
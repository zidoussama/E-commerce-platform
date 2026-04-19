const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// @route POST /api/comments/add
// @desc Add a new comment
// @access Public
router.post('/add', commentController.addComment);

// @route GET /api/comments
// @desc Fetch comments for a product
// @access Public
router.get('/', commentController.getProductComments);

// @route PUT /api/comments/:id
// @desc Update a comment
// @access Public
router.put('/:id', commentController.updateComment);

// @route DELETE /api/comments/:id
// @desc Delete a comment
// @access Public
router.delete('/:id', commentController.deleteComment);

// @route GET /api/comments/all
// @desc Get all comments
// @access Public
router.get('/all', commentController.getAllComments);

module.exports = router;
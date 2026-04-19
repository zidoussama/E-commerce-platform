const express = require('express');
const router = express.Router();
const Comment = require('../../models/Comment');

// POST /api/comments/add - Add a new comment
router.post('/add', async (req, res) => {
  const { userId, productId, text } = req.body;

  if (!userId || !productId || !text) {
    return res.status(400).json({ message: 'User ID, Product ID, and comment text are required' });
  }

  try {
    const comment = new Comment({
      userId,
      productId,
      text
    });

    await comment.save();
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/comments - Fetch comments for a product
router.get('/', async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const comments = await Comment.find({ productId })
      .populate('userId', 'username') // Populate user details (e.g., username)
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/comments/:id - Update a comment
router.put('/:id', async (req, res) => {
  const { text } = req.body;
  const commentId = req.params.id;

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.text = text;
    await comment.save();
    res.json({ message: 'Comment updated successfully', comment });
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/all', async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('userId', 'username firstname lastname email') // Populate user details
      .populate('productId', 'name image') // Populate product details
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(comments);
  } catch (err) {
    console.error('Error fetching all comments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
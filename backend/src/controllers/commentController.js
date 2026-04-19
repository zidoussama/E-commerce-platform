const Comment = require('../models/Comment');

class CommentController {
  // Add a new comment
  async addComment(req, res) {
    try {
      const { userId, productId, text } = req.body;

      if (!userId || !productId || !text) {
        return res.status(400).json({ message: 'User ID, Product ID, and comment text are required' });
      }

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
  }

  // Fetch comments for a product
  async getProductComments(req, res) {
    try {
      const { productId } = req.query;

      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
      }

      const comments = await Comment.find({ productId })
        .populate('userId', 'username')
        .sort({ createdAt: -1 });

      res.json(comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update a comment
  async updateComment(req, res) {
    try {
      const { text } = req.body;
      const commentId = req.params.id;

      if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
      }

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
  }

  // Delete a comment
  async deleteComment(req, res) {
    try {
      const commentId = req.params.id;

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
  }

  // Get all comments
  async getAllComments(req, res) {
    try {
      const comments = await Comment.find()
        .populate('userId', 'username firstname lastname email')
        .populate('productId', 'name image')
        .sort({ createdAt: -1 });

      res.json(comments);
    } catch (err) {
      console.error('Error fetching all comments:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new CommentController();
const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'The user is required']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'The product is required']
  }
}, {
  timestamps: true
});

// Ensure a user can only like a product once
likesSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.models.Likes || mongoose.model('Likes', likesSchema);
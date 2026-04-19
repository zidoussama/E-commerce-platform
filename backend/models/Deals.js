const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  images: {
    type: [String], // Array of strings to store image paths
    required: true,
    validate: {
      validator: function (array) {
        return array.length > 0; // Ensure at least one image is provided
      },
      message: 'At least one image is required for a deal.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Deal', dealSchema);
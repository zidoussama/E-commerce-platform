const mongoose = require('mongoose');

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The category name is required'], // Name is required, with a custom error message
    unique: true, // Ensures no two categories can have the same name
    trim: true // Removes leading/trailing whitespace from the name
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the Category model
module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
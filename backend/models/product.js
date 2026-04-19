const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name is required'],
  },
  description: {
    type: String,
    required: [true, 'The description is required'],
  },
  price: {
    type: Number,
    required: [true, 'The price is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'The category is required']
  },
  stock: {
    type: Number,
    required: [true, 'The stock is required'],
  },
  size: [{ type: String, required: false }],
  
  image: {
    type: mongoose.Mixed,
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(v) {
        if (typeof v === 'string') return true;
        if (Array.isArray(v)) {
          return v.length > 0 && v.every(item => typeof item === 'string');
        }
        return false;
      },
      message: 'Image must be a string or an array of strings'
    }
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
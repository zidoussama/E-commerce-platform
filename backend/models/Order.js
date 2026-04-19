const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      size: {
        type: String,
        default: null // Optional size field for cart items
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  deliveryMethod: {
    type: String,
    required: true,
    enum: ['Standard', 'Express']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash on Delivery', 'PayPal']
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
  paypalOrderId: { type: String, required: false }, // Add for PayPal
  paymentStatus: { type: String, required: false }, // Add for PayPal
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
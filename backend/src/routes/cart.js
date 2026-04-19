const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// @route GET /api/cart
// @desc Get the cart for the logged-in user
// @access Public
router.get('/', cartController.getCart);

// @route POST /api/cart/add
// @desc Add a product to the cart
// @access Public
router.post('/add', cartController.addToCart);

// @route PUT /api/cart/update
// @desc Update the quantity of a product in the cart
// @access Public
router.put('/update', cartController.updateCartItem);

// @route DELETE /api/cart/remove
// @desc Remove a product from the cart
// @access Public
router.delete('/remove', cartController.removeFromCart);

// @route DELETE /api/cart/clear
// @desc Clear the entire cart for the user
// @access Public
router.delete('/clear', cartController.clearCart);

module.exports = router;
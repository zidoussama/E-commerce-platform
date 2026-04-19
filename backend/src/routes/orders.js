const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// @route POST /api/orders
// @desc Place a new order
// @access Public
router.post('/', orderController.placeOrder);

// @route GET /api/orders
// @desc Get all orders for a user by userId
// @access Public
router.get('/', orderController.getUserOrders);

// @route GET /api/orders/all
// @desc Get all orders
// @access Public
router.get('/all', orderController.getAllOrders);

// @route PUT /api/orders/:id
// @desc Update an order by ID
// @access Public
router.put('/:id', orderController.updateOrder);

// @route DELETE /api/orders/:id
// @desc Delete an order by ID
// @access Public
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
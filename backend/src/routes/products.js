const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// @route POST /api/products
// @desc Create new product
// @access Public
router.post('/', productController.createProduct);

// @route GET /api/products
// @desc Get all products
// @access Public
router.get('/', productController.getAllProducts);

// @route GET /api/products/:id
// @desc Get single product
// @access Public
router.get('/:id', productController.getProductById);

// @route PUT /api/products/:id
// @desc Update product
// @access Public
router.put('/:id', productController.updateProduct);

// @route DELETE /api/products/:id
// @desc Delete product
// @access Public
router.delete('/:id', productController.deleteProduct);

// @route GET /api/products/category/:categoryId
// @desc Get products by category
// @access Public
router.get('/category/:categoryId', productController.getProductsByCategory);

module.exports = router;
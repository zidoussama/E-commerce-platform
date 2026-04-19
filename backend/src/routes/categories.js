const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// @route POST /api/categories/add
// @desc Create a new category
// @access Public
router.post('/add', categoryController.createCategory);

// @route GET /api/categories
// @desc Get all categories
// @access Public
router.get('/', categoryController.getAllCategories);

// @route GET /api/categories/:id
// @desc Get a single category by ID
// @access Public
router.get('/:id', categoryController.getCategoryById);

// @route PUT /api/categories/:id
// @desc Update a category
// @access Public
router.put('/:id', categoryController.updateCategory);

// @route DELETE /api/categories/:id
// @desc Delete a category
// @access Public
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
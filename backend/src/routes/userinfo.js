const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/userinfo/:id - Fetch user info (excluding password)
router.get('/:id', userController.getUserById);

// POST /api/userinfo - Create a new user
router.post('/', userController.createUser);

// PUT /api/userinfo/:id - Update user info
router.put('/:id', userController.updateUser);

// DELETE /api/userinfo/:id - Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
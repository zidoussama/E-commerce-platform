
// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard stats route
router.get('/stats', dashboardController.isAdmin, dashboardController.getDashboardStats);

module.exports = router;
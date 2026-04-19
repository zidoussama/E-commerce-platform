const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');

// POST /api/deals - Create a new deal with Base64-encoded images
router.post('/', dealController.createDeal);

// GET /api/deals - Retrieve all deals
router.get('/', dealController.getAllDeals);

// GET /api/deals/:id - Retrieve a deal by ID
router.get('/:id', dealController.getDealById);

// DELETE /api/deals/:id - Delete a deal
router.delete('/:id', dealController.deleteDeal);

module.exports = router;
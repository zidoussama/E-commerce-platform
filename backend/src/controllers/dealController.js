const Deal = require('../models/Deals');

// Create a new deal with Base64-encoded images
const createDeal = async (req, res) => {
  try {
    const { images } = req.body;

    // Validate that images are provided
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Validate that each image is a valid Base64 string
    const base64Regex = /^data:image\/(jpeg|png|jpg);base64,/;
    for (const image of images) {
      if (!base64Regex.test(image)) {
        return res.status(400).json({ message: 'Invalid image format. Images must be Base64-encoded JPEG, JPG, or PNG.' });
      }
    }

    // Create a new deal
    const deal = new Deal({
      images: images,
    });

    // Save the deal to the database
    await deal.save();

    res.status(201).json({ message: 'Deal created successfully', deal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all deals
const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a deal by ID
const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.status(200).json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a deal
const deleteDeal = async (req, res) => {
  try {
    // Find the deal by ID
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Delete the deal from the database
    await Deal.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createDeal,
  getAllDeals,
  getDealById,
  deleteDeal
};
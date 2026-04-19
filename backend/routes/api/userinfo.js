const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add mongoose import for ObjectId validation
const User = require('../../models/User');

// GET /api/userinfo/:id - Fetch user info (excluding password)
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/userinfo - Create a new user
// TODO: Add validation middleware to ensure required fields are provided
router.post('/', async (req, res) => {
  const { firstname, lastname, email, password, phonenumber } = req.body;

  // Basic validation
  if (!firstname || !lastname || !email || !password || !phonenumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({
      firstname,
      lastname,
      email,
      password, // Note: In production, hash the password before saving
      phonenumber
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user: user.toObject({ getters: true, transform: (doc, ret) => { delete ret.password; return ret; } }) });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/userinfo/:id - Update user info
// TODO: Add authentication middleware to ensure only the user can update their own info
router.put('/:id', async (req, res) => {
  const userId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const { firstname, lastname, email, phonenumber, password, address, city, postalCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (phonenumber) user.phonenumber = phonenumber;
    if (password) user.password = password; // Note: In production, hash the password
    if (address) user.address = address; // Added address
    if (city) user.city = city; // Added city
    if (postalCode) user.postalCode = postalCode; // Added postalCode

    await user.save();
    res.json({ 
      message: 'User updated successfully', 
      user: user.toObject({ getters: true, transform: (doc, ret) => { delete ret.password; return ret; } }) 
    });
  } catch (err) {
    console.error('Error updating user:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/userinfo/:id - Delete a user
// TODO: Add authentication middleware to ensure only the user or an admin can delete
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
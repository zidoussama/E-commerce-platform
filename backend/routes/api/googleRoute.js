const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../../models/User');

// Load environment variables
require('dotenv').config();

const GOOGLE_CLIENT_ID = '117787534864-b6djrq92cb0tfet0eodijlgso0136esg.apps.googleusercontent.com';
const JWT_SECRET = '117787534864com';

if (!GOOGLE_CLIENT_ID || !JWT_SECRET) {
  throw new Error('Missing required environment variables');
}

// Initialize OAuth2Client
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Credential is required' });
    }

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload.email_verified) {
      return res.status(401).json({ message: 'Email not verified with Google' });
    }

    const { email, sub: googleId, name } = payload;

    // Check if user exists or create a new one
    let user = await User.findOne({ googleId });
    if (!user) {
      // Split name into firstname and lastname (if available)
      const nameParts = name ? name.split(' ') : [email.split('@')[0], ''];
      user = await User.create({
        googleId,
        email,
        firstname: nameParts[0] || email.split('@')[0], // Fallback to email username
        lastname: nameParts[1] || '', // Empty if no lastname
        role: 'user',
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token: jwtToken, role: user.role, user });
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(401).json({ message: 'Google login failed: ' + error.message });
  }
});

module.exports = router;
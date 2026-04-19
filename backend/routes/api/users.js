require("dotenv").config(); // Load environment variables from .env
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const User = require("../../models/User"); // Adjust path if needed

// Configure Nodemailer using .env variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Loaded from .env
    pass: process.env.EMAIL_PASS, // Loaded from .env
  },
});

// @route POST api/users/register
// @desc Register new user
// @access Public
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password, phonenumber } = req.body;

  if (!firstname || !lastname || !email || !password || !phonenumber) {
    return res.status(400).json({ message: "Please enter all required data" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phonenumber,
      role: "user", // Explicitly set to match login
    });

    const user = await newUser.save();
    const token = jwt.sign({ id: user.id, role: user.role }, config.get("jwtSecret"), {
      expiresIn: config.get("tokenExpire"),
    });

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route POST api/users/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.get("jwtSecret"), {
      expiresIn: config.get("tokenExpire"),
    });

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route POST api/users/forgot-password
// @desc Send password reset code
// @access Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const resetCode = Math.random().toString(36).substring(2, 8); // 6-char code
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    user.resetCode = resetCode;
    user.resetCodeExpiration = expiration;
    await user.save();

    await transporter.sendMail({
      from: `"StreamGalaxy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Hello,\n\nWe’re happy to help you get back into your shop account! Your password reset code is: ${resetCode}. Please use it within the next 15 minutes before it expires.\n\nIf you need any assistance, feel free to reach out. Welcome back—we’re glad you’re here!\n\nBest regards,\nThe StreamGalaxy Team`,
    });

    res.json({ message: "Reset code sent to your email. Please check your inbox." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error sending reset code" });
  }
});

// @route POST api/users/verify-reset-code
// @desc Verify reset code
// @access Public
router.post("/verify-reset-code", async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.resetCode !== resetCode || user.resetCodeExpiration < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    res.json({ message: "Code verified. Please enter your new password." });
  } catch (err) {
    console.error("Verify reset code error:", err);
    res.status(500).json({ message: "Error verifying reset code" });
  }
});

// @route POST api/users/reset-password
// @desc Reset password with code
// @access Public
router.post("/reset-password", async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.resetCode !== resetCode || user.resetCodeExpiration < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetCode = null;
    user.resetCodeExpiration = null;
    await user.save();

    res.json({ message: "Password reset successful. Please log in with your new password." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
});

// @route POST api/users/send-email-verification-code
// @desc Send email verification code for email change
// @access Public
router.post("/send-email-verification-code", async (req, res) => {
  const { currentEmail } = req.body; // Expect the current email in the request body

  if (!currentEmail) {
    return res.status(400).json({ message: "Please provide the current email" });
  }

  try {
    const user = await User.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check 90-day restriction
    if (user.lastEmailChange) {
      const lastChange = new Date(user.lastEmailChange);
      const now = new Date();
      const daysSinceLastChange = (now - lastChange) / (1000 * 60 * 60 * 24);
      if (daysSinceLastChange < 90) {
        return res.status(403).json({ message: "Cannot change email within 90 days of last change" });
      }
    }

    // Check if a valid code already exists
    if (user.emailVerificationCode && user.emailVerificationCodeExpiration > Date.now()) {
      return res.status(400).json({ message: "A valid verification code already exists. Please use it or wait until it expires to request a new one." });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    user.emailVerificationCode = verificationCode;
    user.emailVerificationCodeExpiration = expiration;
    await user.save();

    await transporter.sendMail({
      from: `"StreamGalaxy" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Email Change Verification Code",
      text: `Hello,\n\nYou have requested to change your email address. Your verification code is: ${verificationCode}. Please use it within the next 15 minutes before it expires.\n\nIf you did not request this change, please ignore this email.\n\nBest regards,\nThe StreamGalaxy Team`,
    });

    res.json({ message: "Verification code sent to your email. Please check your inbox." });
  } catch (err) {
    console.error("Send email verification code error:", err);
    res.status(500).json({ message: "Error sending verification code" });
  }
});

// @route POST api/users/resend-email-verification-code
// @desc Resend email verification code for email change
// @access Public
router.post("/resend-email-verification-code", async (req, res) => {
  const { currentEmail } = req.body;

  if (!currentEmail) {
    return res.status(400).json({ message: "Please provide the current email" });
  }

  try {
    const user = await User.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a code exists and is still valid
    if (user.emailVerificationCode && user.emailVerificationCodeExpiration > Date.now()) {
      return res.status(400).json({ message: "A valid verification code already exists. Please use it or wait until it expires to request a new one." });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    user.emailVerificationCode = verificationCode;
    user.emailVerificationCodeExpiration = expiration;
    await user.save();

    await transporter.sendMail({
      from: `"StreamGalaxy" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Email Change Verification Code",
      text: `Hello,\n\nYou have requested a new verification code to change your email address. Your new verification code is: ${verificationCode}. Please use it within the next 15 minutes before it expires.\n\nIf you did not request this change, please ignore this email.\n\nBest regards,\nThe StreamGalaxy Team`,
    });

    res.json({ message: "A new verification code has been sent to your email. Please check your inbox." });
  } catch (err) {
    console.error("Resend email verification code error:", err);
    res.status(500).json({ message: "Error resending verification code" });
  }
});

// @route POST api/users/verify-email-change
// @desc Verify code and update email
// @access Public
router.post("/verify-email-change", async (req, res) => {
  const { currentEmail, code, newEmail } = req.body;

  if (!currentEmail || !code || !newEmail) {
    return res.status(400).json({ message: "Please provide the current email, verification code, and new email" });
  }

  try {
    const user = await User.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    

    if (user.emailVerificationCode !== code || user.emailVerificationCodeExpiration < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Check if the new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser.email !== currentEmail) {
      return res.status(400).json({ message: "New email already exists" });
    }

    user.email = newEmail;
    user.lastEmailChange = new Date();
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpiration = null;
    await user.save();

    res.json({ message: "Email updated successfully" });
  } catch (err) {
    console.error("Verify email change error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "New email already exists" });
    }
    res.status(500).json({ message: "Error updating email" });
  }
});

// GET /api/users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
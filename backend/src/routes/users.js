const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// @route POST /api/users/register
// @desc Register new user
// @access Public
router.post('/register', userController.register);

// @route POST /api/users/login
// @desc Login user
// @access Public
router.post('/login', userController.login);

// @route POST /api/users/forgot-password
// @desc Send password reset code
// @access Public
router.post('/forgot-password', userController.forgotPassword);

// @route POST /api/users/verify-reset-code
// @desc Verify reset code
// @access Public
router.post('/verify-reset-code', userController.verifyResetCode);

// @route POST /api/users/reset-password
// @desc Reset password with code
// @access Public
router.post('/reset-password', userController.resetPassword);

// @route POST /api/users/send-email-verification-code
// @desc Send email verification code for email change
// @access Public
router.post('/send-email-verification-code', userController.sendEmailVerificationCode);

// @route POST /api/users/resend-email-verification-code
// @desc Resend email verification code for email change
// @access Public
router.post('/resend-email-verification-code', userController.resendEmailVerificationCode);

// @route POST /api/users/verify-email-change
// @desc Verify code and update email
// @access Public
router.post('/verify-email-change', userController.verifyEmailChange);

// @route GET /api/users
// @desc Fetch all users
// @access Public
router.get('/', userController.getAllUsers);

module.exports = router;
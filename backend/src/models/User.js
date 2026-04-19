const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [function () { return !this.googleId; }, 'The firstname is required'], // Required only if not Google user
    default: '', // Default for Google users
  },
  lastname: {
    type: String,
    required: [function () { return !this.googleId; }, 'The lastname is required'],
    default: '',
  },
  email: {
    type: String,
    required: [true, 'The email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [function () { return !this.googleId; }, 'The password is required'],
    minlength: [6, 'The password must be at least 6 characters long'],
  },
  phonenumber: {
    type: String,
    required: [function () { return !this.googleId; }, 'The phonenumber is required'],
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  postalCode: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: 'user',
  },
  resetCode: {
    type: String,
    default: null,
  },
  resetCodeExpiration: {
    type: Date,
    default: null,
  },
  emailVerificationCode: {
    type: String,
    default: null,
  },
  emailVerificationCodeExpiration: {
    type: Date,
    default: null,
  },
  lastEmailChange: {
    type: Date,
    default: null,
  },
  googleId: {
    type: String,
    default: null,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true, // Remove leading and trailing whitespaces
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        // Basic mobile number validation (example: 1234567890)
        return /^\d{10}$/.test(value);
      },
      message: props => `${props.value} is not a valid mobile number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Convert to lowercase
    validate: {
      validator: function(value) {
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length of the password
    maxlength: 16, // Maximum length of the password
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);

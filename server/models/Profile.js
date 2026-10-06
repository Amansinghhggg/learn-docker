const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      default: 'Developer',
      trim: true,
    },
    bio: {
      type: String,
      default: 'Fullstack developer exploring modern web applications.',
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Developer',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', ProfileSchema);

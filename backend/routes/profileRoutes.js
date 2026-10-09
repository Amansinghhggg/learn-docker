const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// @route   GET /api/profiles
// @desc    Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/profiles/:id
// @desc    Get single profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/profiles
// @desc    Create a new profile
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, password, role, bio, avatar } = req.body;

    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, address, and password are required',
      });
    }

    const newProfile = await Profile.create({
      name,
      email,
      phone,
      address,
      password,
      role: role || 'Software Developer',
      bio: bio || 'Passionate about building fullstack applications.',
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    });

    res.status(201).json({
      success: true,
      message: 'Profile created successfully!',
      data: newProfile,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/profiles/:id
// @desc    Update a profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/profiles/:id
// @desc    Delete a profile
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Profile.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({
      success: true,
      message: 'Profile deleted successfully!',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/profiles/seed
// @desc    Seed sample profiles for quick testing
router.post('/seed', async (req, res) => {
  try {
    const sampleProfiles = [
      {
        name: 'Alex Johnson',
        email: 'alex.j@example.com',
        phone: '+1 (555) 019-2834',
        address: '404 Innovation Way, San Francisco, CA',
        password: 'samplePassword123!',
        role: 'Fullstack Engineer',
        bio: 'Building modern and scalable web applications.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
      },
      {
        name: 'Samira Patel',
        email: 'samira.p@example.com',
        phone: '+1 (555) 742-9901',
        address: '77 Tech Park Blvd, Austin, TX',
        password: 'securePass#2026',
        role: 'Frontend Developer',
        bio: 'Connecting modern UI components to backend APIs.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Samira',
      },
      {
        name: 'Jordan Lee',
        email: 'jordan.l@example.com',
        phone: '+1 (555) 883-1120',
        address: '12 Harbor Road, Seattle, WA',
        password: 'mypassword999',
        role: 'Backend Architect',
        bio: 'Designing robust database schemas and REST APIs.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jordan',
      },
    ];

    await Profile.deleteMany({});
    const inserted = await Profile.insertMany(sampleProfiles);

    res.status(201).json({
      success: true,
      message: 'Sample profiles seeded successfully!',
      data: inserted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

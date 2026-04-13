const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Invitation = require('../models/Invitation');

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Check for invitation
    const invitation = await Invitation.findOne({ email, status: 'pending' });
    if (invitation) {
      user.institution_id = invitation.institution_id;
      user.role = 'alumni';
      invitation.status = 'accepted';
      await invitation.save();
    }

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/user
// @desc    Get user by token
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
router.put('/profile', auth, async (req, res) => {
  const { name, course, batch, company, profile_pic } = req.body;
  try {
    // Create an update object with only provided fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (course !== undefined) updateFields.course = course;
    if (batch !== undefined) updateFields.batch = batch;
    if (company !== undefined) updateFields.company = company;
    if (profile_pic !== undefined) updateFields.profile_pic = profile_pic;
    updateFields.updated_at = Date.now();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log(`Profile updated for ${user.email}. Pic status: ${profile_pic ? 'Image Provided (' + profile_pic.length + ' chars)' : 'No Image Change'}`);
    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;

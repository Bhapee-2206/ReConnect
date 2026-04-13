const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Institution = require('../models/Institution');
const User = require('../models/User');

// Generate a random 8-char uppercase alphanumeric join code
function generateJoinCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// @route   POST api/institutions
// @desc    Create institution (one per admin only) - user becomes college_admin
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    // Enforce unique name (case-insensitive)
    const nameExists = await Institution.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (nameExists) {
      return res.status(400).json({ msg: 'An institution with this name already exists.' });
    }

    const existing = await Institution.findOne({ admin_id: req.user.id });
    if (existing) {
      return res.status(400).json({ msg: 'You have already created an institution.' });
    }

    const user = await User.findById(req.user.id);
    if (user.institution_id) {
      return res.status(400).json({ msg: 'You already belong to an institution.' });
    }

    // Generate a unique join code (collision-safe)
    let join_code;
    let codeExists = true;
    while (codeExists) {
      join_code = generateJoinCode();
      codeExists = await Institution.findOne({ join_code });
    }

    const institution = new Institution({ name, join_code, admin_id: req.user.id });
    await institution.save();

    await User.findByIdAndUpdate(req.user.id, {
      institution_id: institution._id,
      role: 'college_admin'
    });

    res.json(institution);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/institutions/my
// @desc    Get the current user's institution (includes join_code for admin)
router.get('/my', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('institution_id');
    res.json(user.institution_id);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/institutions/join
// @desc    Alumni join an institution using a join code
router.post('/join', auth, async (req, res) => {
  const { join_code } = req.body;
  if (!join_code) return res.status(400).json({ msg: 'Join code is required.' });

  try {
    const user = await User.findById(req.user.id);
    if (user.institution_id) {
      return res.status(400).json({ msg: 'You already belong to an institution.' });
    }

    const institution = await Institution.findOne({ join_code: join_code.trim().toUpperCase() });
    if (!institution) {
      return res.status(404).json({ msg: 'Invalid join code. Please check with your institution admin.' });
    }

    await User.findByIdAndUpdate(req.user.id, {
      institution_id: institution._id,
      role: 'alumni'
    });

    res.json({ msg: 'Successfully joined the institution!', institution });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Announcement = require('../models/Announcement');
const User = require('../models/User');

// GET all for user's institution
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.institution_id) return res.json([]);
    
    const announcements = await Announcement.find({ institution_id: user.institution_id }).sort({ created_at: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST new (Admin only)
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'college_admin') return res.status(403).json({ msg: 'Unauthorized' });

    const announcement = new Announcement({
      title,
      content,
      institution_id: user.institution_id
    });
    await announcement.save();
    res.json(announcement);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

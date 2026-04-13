const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// GET all for institution
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.institution_id) return res.json([]);
    const events = await Event.find({ institution_id: user.institution_id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST new (Admin)
router.post('/', auth, async (req, res) => {
  const { title, description, date, location } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'college_admin') return res.status(403).json({ msg: 'Unauthorized' });

    const event = new Event({
      title,
      description,
      date,
      location,
      institution_id: user.institution_id
    });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST register
router.post('/:id/register', auth, async (req, res) => {
  try {
    const registration = new Registration({
      user_id: req.user.id,
      event_id: req.params.id
    });
    await registration.save();
    res.json(registration);
  } catch (err) {
    res.status(500).send('Registration failed');
  }
});

module.exports = router;

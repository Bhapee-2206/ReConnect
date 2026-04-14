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
  const { title, description, date, location, google_form_url, has_custom_form, form_config } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (user.role !== 'college_admin') return res.status(403).json({ msg: 'Unauthorized' });

    const event = new Event({
      title,
      description,
      date,
      location,
      google_form_url,
      has_custom_form: has_custom_form || false,
      form_config: form_config || [],
      institution_id: user.institution_id
    });
    
    await event.save();
    res.json(event);
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// PUT update (Admin)
router.put('/:id', auth, async (req, res) => {
  const { title, description, date, location, google_form_url, has_custom_form, form_config } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (user.role !== 'college_admin') return res.status(403).json({ msg: 'Unauthorized' });

    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    
    // Ensure event belongs to the same institution
    if (event.institution_id.toString() !== user.institution_id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.google_form_url = google_form_url;
    event.has_custom_form = has_custom_form !== undefined ? has_custom_form : event.has_custom_form;
    event.form_config = form_config || event.form_config;

    await event.save();
    res.json(event);
  } catch (err) {
    console.error('Event update error:', err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// POST register
router.post('/:id/register', auth, async (req, res) => {
  try {
    const { form_responses } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if event exists
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const registration = new Registration({
      user_id: req.user.id,
      event_id: req.params.id,
      email: user.email,
      form_responses: form_responses || {}
    });
    await registration.save();
    res.json(registration);
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) return res.status(400).json({ msg: 'You are already registered for this event' });
    res.status(500).send('Registration failed: ' + err.message);
  }
});

// GET responses (Admin only)
router.get('/:id/responses', auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (admin.role !== 'college_admin') return res.status(403).json({ msg: 'Unauthorized' });

    const registrations = await Registration.find({ event_id: req.params.id })
      .populate('user_id', 'name email profile_picture')
      .sort({ created_at: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

/**
 * PUBLIC WEBHOOK FOR GOOGLE FORMS
 * This endpoint receives data from the Google Apps Script.
 * Payload should include 'email' and any other form fields.
 */
router.post('/webhook/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const formData = req.body;
  const email = formData.email || formData.Email || formData['Email Address'];

  if (!email) {
    return res.status(400).json({ msg: 'Email is required in form submission' });
  }

  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Try to find ReConnect user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Upsert registration
    const registration = await Registration.findOneAndUpdate(
      { event_id: eventId, email: email.toLowerCase() },
      {
        user_id: user ? user._id : null,
        form_responses: formData,
        created_at: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, registration });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Webhook process failed');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Invitation = require('../models/Invitation');

// GET directory members
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.institution_id) return res.json([]);

    const { batch, course, company, name } = req.query;
    let filter = { institution_id: user.institution_id };
    
    if (batch && batch !== 'All Batches') filter.batch = batch;
    if (course && course !== 'All Courses') filter.course = course;
    if (company && company !== 'All Companies') filter.company = { $regex: company, $options: 'i' };
    if (name) filter.name = { $regex: name, $options: 'i' };

    const alumni = await User.find(filter).select('-password');
    res.json(alumni);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST invite (Admin)
router.post('/invite', auth, async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await User.findById(req.user.id);
    if (admin.role !== 'college_admin') return res.status(403).json({ msg: 'Unauthorized' });

    const invitation = new Invitation({
      email,
      institution_id: admin.institution_id
    });
    await invitation.save();
    res.json(invitation);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ msg: 'Already invited' });
    res.status(500).send('Server Error');
  }
});

// GET invitations (Admin)
router.get('/invitations', auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    const invitations = await Invitation.find({ institution_id: admin.institution_id }).sort({ created_at: -1 });
    res.json(invitations);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE alumnus (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (admin.role !== 'college_admin') return res.status(403).json({ msg: 'Unauthorized' });

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ msg: 'User not found' });

    // Verify it's the same institution
    if (targetUser.institution_id.toString() !== admin.institution_id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized: User is from another institution' });
    }

    // Unlink from institution
    targetUser.institution_id = null;
    targetUser.role = 'alumni'; // Ensure they are reset to standard alumni
    await targetUser.save();

    res.json({ msg: 'Alumnus removed successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

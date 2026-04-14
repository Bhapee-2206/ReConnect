const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Invitation = require('../models/Invitation');
const Institution = require('../models/Institution');
const { sendEmail } = require('../utils/mailer');

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

    // Fetch institution details for the email
    const institution = await Institution.findById(admin.institution_id);
    
    // Send invitation email
    const appName = process.env.APP_NAME || 'ReConnect';
    const signupLink = `${req.get('origin') || 'http://localhost:5173'}/login?mode=join`;
    
    await sendEmail({
      to: email,
      subject: `Invitation to join ${institution.name} on ${appName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
            <p style="color: #64748b; font-size: 16px;">Connecting Alumni Worldwide</p>
          </div>
          
          <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">You're Invited!</h2>
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              Hello,
            </p>
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              You have been invited to join the official alumni network of <strong>${institution.name}</strong> on ${appName}.
            </p>
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              To get started, please use the following join code during registration:
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <span style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; font-size: 24px; font-weight: bold; border-radius: 6px; letter-spacing: 2px;">
                ${institution.join_code}
              </span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${signupLink}" style="display: inline-block; padding: 14px 28px; background-color: #1e293b; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 6px; font-size: 16px;">
              Create Your Account
            </a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <div style="text-align: center; color: #94a3b8; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      `
    });

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

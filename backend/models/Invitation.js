const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  institution_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

// Unique invitation per email per institution
InvitationSchema.index({ email: 1, institution_id: 1 }, { unique: true });

module.exports = mongoose.model('Invitation', InvitationSchema);

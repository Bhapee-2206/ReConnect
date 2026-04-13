const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  created_at: { type: Date, default: Date.now }
});

RegistrationSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);

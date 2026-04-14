const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for external submissions if user not found
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  email: { type: String, required: true }, // Store email for matching
  form_responses: { type: Object }, // Flexible JSON for Google Form data
  created_at: { type: Date, default: Date.now }
});

// Unique registration per email per event
RegistrationSchema.index({ email: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);

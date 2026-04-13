const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  institution_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);

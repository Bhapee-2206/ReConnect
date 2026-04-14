const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  google_form_url: { type: String },
  has_custom_form: { type: Boolean, default: false },
  form_config: [
    {
      id: { type: String },
      type: { type: String, enum: ['text', 'textarea', 'dropdown', 'radio', 'checkbox'] },
      label: { type: String },
      required: { type: Boolean, default: false },
      options: [{ type: String }] // For dropdown, radio, checkbox
    }
  ],
  institution_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);

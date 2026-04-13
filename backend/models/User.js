const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'alumni', 'college_admin'], default: 'alumni' },
  institution_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
  batch: { type: String },
  course: { type: String },
  company: { type: String },
  profile_pic: { type: String }, // Base64 or URL
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

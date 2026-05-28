// models/Contact.js — Stores submitted contact form messages
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true, maxlength: 80 },
  email:   { type: String, required: true, trim: true },
  subject: { type: String, required: true, maxlength: 120 },
  message: { type: String, required: true, maxlength: 2000 },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);

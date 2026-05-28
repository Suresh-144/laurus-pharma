// models/User.js — User schema with password hashing and JWT helper
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  // 'user' can browse; 'admin' can manage products
  role:  { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

// Hash password before saving if it was modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plain-text password with stored hash
UserSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Generate a signed JWT containing user id and role
UserSchema.methods.signToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = mongoose.model('User', UserSchema);

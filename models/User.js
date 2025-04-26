// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  avatarUrl: { type: String },
  role: { type: String, enum: ['User','Service-Provider','Guard','SocietyAdmin','Admin'], default: 'User' },
  institution: { type: String },
  enrollmentDate: { type: Date, default: Date.now },
  gender: { type: String, enum: ['Male','Female','Other'] },
  password: { type: String, required: true, select: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
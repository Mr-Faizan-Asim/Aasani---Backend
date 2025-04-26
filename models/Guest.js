// models/Guest.js
const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  houseNumber: {
    type: String,
    required: true,
    trim: true,
  },
  colony: {
    type: String,
    required: true,
    trim: true,
  },
  guestName: {
    type: String,
    required: true,
    trim: true,
  },
  visitDate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Guest', GuestSchema);
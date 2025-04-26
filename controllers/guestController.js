// controllers/guestController.js
const Guest = require('../models/Guest');

// @desc    Create new guest entry
// @route   POST /api/guests
// @access  Private
exports.createGuest = async (req, res, next) => {
  try {
    const { houseId, houseNumber, colony, guestName } = req.body;
    if (!houseId || !houseNumber || !colony || !guestName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const guest = await Guest.create({
      user: req.user._id,
      houseId,
      houseNumber,
      colony,
      guestName,
    });
    res.status(201).json(guest);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all guests for a user
// @route   GET /api/guests
// @access  Private
exports.getGuests = async (req, res, next) => {
  try {
    const guests = await Guest.find({ user: req.user._id });
    res.json(guests);
  } catch (err) {
    next(err);
  }
};

// @desc    Get guests by house ID
// @route   GET /api/guests/house/:houseId
// @access  Private
exports.getGuestsByHouseId = async (req, res, next) => {
  try {
    const guests = await Guest.find({ houseId: req.params.houseId });
    if (!guests.length) return res.status(404).json({ message: 'No guests found for this house ID' });
    res.json(guests);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single guest by ID
// @route   GET /api/guests/:id
// @access  Private
exports.getGuestById = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json(guest);
  } catch (err) {
    next(err);
  }
};

// @desc    Update guest entry
// @route   PUT /api/guests/:id
// @access  Private
exports.updateGuest = async (req, res, next) => {
  try {
    const updates = req.body;
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    if (guest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(guest, updates);
    await guest.save();
    res.json(guest);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete guest entry
// @route   DELETE /api/guests/:id
// @access  Private
exports.deleteGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    if (guest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await guest.remove();
    res.json({ message: 'Guest removed' });
  } catch (err) {
    next(err);
  }
};
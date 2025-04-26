const express = require('express');
const router = express.Router();
const {
  createGuest,
  getGuests,
  getGuestById,
  getGuestsByHouseId,
  updateGuest,
  deleteGuest
} = require('../controllers/guestController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createGuest)
  .get(protect, getGuests);

router.route('/house/:houseId')
  .get(protect, getGuestsByHouseId);

router.route('/:id')
  .get(protect, getGuestById)
  .put(protect, updateGuest)
  .delete(protect, deleteGuest);

module.exports = router;

// Integration in server.js
// const guestRoutes = require('./routes/guestRoutes');
// app.use('/api/guests', guestRoutes);

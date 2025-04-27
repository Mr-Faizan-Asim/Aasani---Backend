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
  .post( createGuest)
  .get( getGuests);

router.route('/house/:houseId')
  .get( getGuestsByHouseId);

router.route('/:id')
  .get(getGuestById)
  .put(updateGuest)
  .delete(deleteGuest);

module.exports = router;

// Integration in server.js
// const guestRoutes = require('./routes/guestRoutes');
// app.use('/api/guests', guestRoutes);

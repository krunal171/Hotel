// /routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
// const upload = require('../middleware/upload');
const upload = require('../config/multer');

const bookingController = require('../controllers/bookingController');

router.post('/', upload.single('idProof'), bookingController.createBooking);
router.get('/:bookingId', bookingController.getBooking);
router.post('/:bookingId/confirm-payment', bookingController.confirmPayment);
router.get('/:bookingId/download-bill', bookingController.downloadBill);
router.get('/', bookingController.getAllBookings);
router.delete('/:id', bookingController.deleteBooking);
router.get('/count', bookingController.countBookings);

module.exports = router;

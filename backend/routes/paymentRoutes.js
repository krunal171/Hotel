const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment order
router.post('/create-order', paymentController.createOrder);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Get payment status
router.get('/status/:bookingId', paymentController.getPaymentStatus);

module.exports = router;

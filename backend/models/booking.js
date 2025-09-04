// /models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  idProofUrl: {
    type: String,
    required: true
  },
  persons: {
    type: Number,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  billPdfPath: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  razorpayOrderId: {
    type: String
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

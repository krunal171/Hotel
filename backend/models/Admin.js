// /models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  // pass: {
  //   type: Number,
  //   required: true,
  //   unique: true
  // },
  otp: {
    type: String
  },
  otpExpiresAt: {
    type: Date
  },
  isMaster: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);

// // /routes/adminRoutes.js
// const express = require('express');
// const router = express.Router();
// const { sendOtp, verifyOtp } = require('../controllers/adminController');

// router.post('/send-otp', sendOtp);
// router.post('/verify-otp', verifyOtp);

// // Master only routes
// // router.post('/add-admin', addAdmin);
// // router.delete('/delete-admin', deleteAdmin);


// module.exports = router;




// /routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
  sendOtp, 
  verifyOtp, 
  addAdmin, 
  deleteAdmin,
  getAllAdmins 
} = require('../controllers/adminController');

// Authentication routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Admin management routes (Master only)
router.post('/add-admin', addAdmin);
// Canonical endpoints
router.delete('/:adminId', deleteAdmin); // DELETE /api/admin/:adminId?requesterId=xxx
router.get('/all-admins', getAllAdmins); // GET /api/admin/all-admins?requesterId=xxx

module.exports = router;

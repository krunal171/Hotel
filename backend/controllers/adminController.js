// // /controllers/adminController.js
// const Admin = require('../models/Admin');
// const transporter = require('../config/nodemailer');

// // Generate 6-digit OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// exports.sendOtp = async (req, res) => {
//   const { email } = req.body;

//   try {
//     let admin = await Admin.findOne({ email });

//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     const otp = generateOTP();
//     const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

//     admin.otp = otp || 3546;
//     admin.otpExpiresAt = otpExpiresAt;
//     await admin.save();

//     await transporter.sendMail({
//       from: process.env.MAIL_USER,
//       to: email,
//       subject: 'Your Admin OTP',
//       text: `Your OTP is: ${otp}`
//     });

//     res.json({ message: 'OTP sent to email' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'OTP sending failed' });
//   }
// };

// exports.verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const admin = await Admin.findOne({ email });

//     if (!admin || admin.otp !== otp) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     if (admin.otpExpiresAt < new Date()) {
//       return res.status(400).json({ message: 'OTP expired' });
//     }

//     // Clear OTP after use
//     admin.otp = null;
//     admin.otpExpiresAt = null;
//     await admin.save();

//     // res.status(200).json({ message: 'Login successful' });
//     //  Send back admin info including isMaster
//     res.status(200).json({
//       message: 'Login successful',
//       admin: {
//         email: admin.email,
//         isMaster: admin.isMaster
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'OTP verification failed' });
//   }
// };

// exports.addAdmin = async (req, res) => {
//   try {
//     const { email, isMaster, requesterId } = req.body;

//     // Check if requester is master
//     const requester = await Admin.findById(requesterId);
//     if (!requester || !requester.isMaster) {
//       return res.status(403).json({ message: "Only master admin can add new admins" });
//     }

//     // Check if admin already exists
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin with this email already exists" });
//     }

//     const newAdmin = new Admin({
//       email,
//       isMaster: isMaster || false,
//     });

//     await newAdmin.save();
//     res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
//   } catch (err) {
//     res.status(500).json({ message: "Error adding admin", error: err.message });
//   }
// };




// // ------------------ DELETE ADMIN (Master only) ------------------
// exports.deleteAdmin = async (req, res) => {
//   try {
//     const { adminId, requesterId } = req.body;

//     // Check if requester is master
//     const requester = await Admin.findById(requesterId);
//     if (!requester || !requester.isMaster) {
//       return res.status(403).json({ message: "Only master admin can delete admins" });
//     }

//     // Prevent deleting self
//     if (requesterId === adminId) {
//       return res.status(400).json({ message: "You cannot delete yourself" });
//     }

//     const deletedAdmin = await Admin.findByIdAndDelete(adminId);
//     if (!deletedAdmin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.status(200).json({ message: "Admin deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting admin", error: err.message });
//   }
// };






// /controllers/adminController.js
const Admin = require('../models/Admin');
const transporter = require('../config/nodemailer');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email input
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Fixed: Remove the fallback value || 3546 - this was a security issue
    admin.otp = otp;
    admin.otpExpiresAt = otpExpiresAt;
    await admin.save();

    // Send email with error handling
    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Your Admin OTP',
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('sendOtp error:', err);
    res.status(500).json({ message: 'OTP sending failed' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if OTP exists
    if (!admin.otp) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    // Check OTP expiration first
    if (admin.otpExpiresAt < new Date()) {
      // Clear expired OTP
      admin.otp = null;
      admin.otpExpiresAt = null;
      await admin.save();
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Compare OTP (convert both to string for safe comparison)
    if (admin.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    admin.otp = null;
    admin.otpExpiresAt = null;
    await admin.save();

    // Send back admin info including isMaster
    res.status(200).json({
      message: 'Login successful',
      admin: {
        _id: admin._id, // MongoDB auto-generates _id
        email: admin.email,
        isMaster: admin.isMaster
      }
    });

  } catch (error) {
    console.error('verifyOtp error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const { email, isMaster, requesterId } = req.body;

    // Validate input
    if (!email || !requesterId) {
      return res.status(400).json({ message: "Email and requesterId are required" });
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if requester exists and is master
    const requester = await Admin.findById(requesterId);
    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }
    
    if (!requester.isMaster) {
      return res.status(403).json({ message: "Only master admin can add new admins" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const newAdmin = new Admin({
      email: email.toLowerCase(),
      isMaster: Boolean(isMaster), // Ensure boolean value
    });

    await newAdmin.save();
    
    // Don't send sensitive data back
    res.status(201).json({ 
      message: "Admin created successfully", 
      admin: {
        _id: newAdmin._id, // MongoDB auto-generates _id
        email: newAdmin.email,
        isMaster: newAdmin.isMaster
      }
    });
  } catch (err) {
    console.error('addAdmin error:', err);
    res.status(500).json({ message: "Error adding admin", error: err.message });
  }
};

// exports.deleteAdmin = async (req, res) => {
//   try {
//     const { adminId, requesterId } = req.body;

//     // Validate input
//     if (!adminId || !requesterId) {
//       return res.status(400).json({ message: "adminId and requesterId are required" });
//     }

//     // Check if requester exists and is master
//     const requester = await Admin.findById(requesterId);
//     if (!requester) {
//       return res.status(404).json({ message: "Requester not found" });
//     }
    
//     if (!requester.isMaster) {
//       return res.status(403).json({ message: "Only master admin can delete admins" });
//     }

//     // Prevent deleting self
//     if (requesterId === adminId) {
//       return res.status(400).json({ message: "You cannot delete yourself" });
//     }

//     // Check if admin to delete exists
//     const adminToDelete = await Admin.findById(adminId);
//     if (!adminToDelete) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     // Prevent deleting another master admin (optional security measure)
//     if (adminToDelete.isMaster) {
//       return res.status(403).json({ message: "Cannot delete another master admin" });
//     }

//     await Admin.findByIdAndDelete(adminId);

//     res.status(200).json({ message: "Admin deleted successfully" });
//   } catch (err) {
//     console.error('deleteAdmin error:', err);
//     res.status(500).json({ message: "Error deleting admin", error: err.message });
//   }
// };
exports.deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;      // 🔹 get adminId from URL param
    const { requesterId } = req.query;   // 🔹 get requesterId from query string

    // Validate input
    if (!adminId || !requesterId) {
      return res.status(400).json({ message: "adminId and requesterId are required" });
    }

    // Check if requester exists and is master
    const requester = await Admin.findById(requesterId);
    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    if (!requester.isMaster) {
      return res.status(403).json({ message: "Only master admin can delete admins" });
    }

    // Prevent deleting self
    if (requesterId === adminId) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    // Check if admin to delete exists
    const adminToDelete = await Admin.findById(adminId);
    if (!adminToDelete) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deleting another master admin
    if (adminToDelete.isMaster) {
      return res.status(403).json({ message: "Cannot delete another master admin" });
    }

    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("deleteAdmin error:", err);
    res.status(500).json({ message: "Error deleting admin", error: err.message });
  }
};


// Get all admins (Master only)
exports.getAllAdmins = async (req, res) => {
  try {
    const { requesterId } = req.query;

    if (!requesterId) {
      return res.status(400).json({ message: "requesterId is required" });
    }

    // Check if requester is master
    const requester = await Admin.findById(requesterId);
    if (!requester || !requester.isMaster) {
      return res.status(403).json({ message: "Only master admin can view all admins" });
    }

    const admins = await Admin.find({}, { otp: 0, otpExpiresAt: 0 }); // Exclude sensitive fields

    res.status(200).json({ 
      message: "Admins retrieved successfully",
      admins: admins.map(admin => ({
        _id: admin._id, // MongoDB auto-generates _id
        email: admin.email,
        isMaster: admin.isMaster,
        createdAt: admin.createdAt
      }))
    });
  } catch (err) {
    console.error('getAllAdmins error:', err);
    res.status(500).json({ message: "Error retrieving admins", error: err.message });
  }
};
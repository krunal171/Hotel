// /controllers/bookingController.js
const Booking = require('../models/booking');
const Room = require('../models/room');
const generateBillPdf = require('../utils/generatePdf');
const path = require('path');
const fs = require('fs');

exports.createBooking = async (req, res) => {
  try {
    const {
      roomId,
      customerName,
      phone,
      persons,
      checkInDate,
      checkOutDate,
      totalPrice
    } = req.body;

    const idProofUrl = req.file?.path; // multer file
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(400).json({ message: 'Room not found' });
    }

    // Check if room is available for the given dates
    const existingBooking = await Booking.findOne({
      roomId: roomId,
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) },
      bookingStatus: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Room not available for selected dates' });
    }

    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);

    const newBooking = new Booking({
      roomId,
      customerName,
      phone,
      idProofUrl,
      persons,
      checkInDate: inDate,
      checkOutDate: outDate,
      totalPrice: parseFloat(totalPrice),
      paymentStatus: 'pending',
      bookingStatus: 'confirmed'
    });

    await newBooking.save();

    res.status(201).json({ 
      message: 'Booking created successfully. Please proceed to payment.',
      booking: newBooking 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking failed' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Generate PDF bill
    const billPath = path.join(__dirname, `../uploads/bills/bill_${booking._id}.pdf`);
    
    // Ensure bills directory exists
    const billsDir = path.dirname(billPath);
    if (!fs.existsSync(billsDir)) {
      fs.mkdirSync(billsDir, { recursive: true });
    }
    
    await generateBillPdf(booking, billPath);
    booking.billPdfPath = billPath;
    await booking.save();

    res.json({ 
      message: 'Booking confirmed successfully',
      booking: booking,
      billPath: billPath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to confirm booking' });
  }
};



exports.downloadBill = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.billPdfPath || !fs.existsSync(booking.billPdfPath)) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.download(booking.billPdfPath, `bill_${bookingId}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to download bill' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("roomId"); // populate room details
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId).populate('roomId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get booking' });
  }
};

//  Count all bookings
// exports.countBookings = async (req, res) => {
//   try {
//     const count = await Booking.countDocuments();
//     res.status(200).json({ totalBookings: count });
//   } catch (error) {
//     console.error("Error counting bookings:", error);
//     res.status(500).json({ message: "Error fetching bookings count", error });
//   }
// };

exports.countBookings = async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    res.status(200).json({ count });  //  unified response
  } catch (error) {
    console.error("Error counting bookings:", error);
    res.status(500).json({ message: "Error fetching bookings count", error });
  }
};

// exports.countRooms = async (req, res) => {
//   try {
//     const count = await Room.countDocuments();
//     res.status(200).json({ count });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching rooms count", error });
//   }
// };

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booking", error: err.message });
  }
};

// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Booking = require('../models/booking');

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Create payment order
// exports.createOrder = async (req, res) => {
//   try {
//     const { bookingId } = req.body;
    
//     const booking = await Booking.findById(bookingId).populate('roomId');
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     if (booking.paymentStatus === 'completed') {
//       return res.status(400).json({ message: 'Payment already completed' });
//     }

//     const options = {
//       amount: booking.totalPrice * 100, // Razorpay expects amount in paise
//       currency: 'INR',
//       receipt: `booking_${bookingId}`,
//       notes: {
//         bookingId: bookingId,
//         customerName: booking.customerName,
//         roomType: booking.roomId.title
//       }
//     };

//     const order = await razorpay.orders.create(options);
    
//     // Update booking with order ID
//     booking.razorpayOrderId = order.id;
//     await booking.save();

//     res.json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       booking: booking
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Failed to create payment order' });
//   }
// };

// // Verify payment
// exports.verifyPayment = async (req, res) => {
//   try {
//     const { 
//       razorpay_order_id, 
//       razorpay_payment_id, 
//       razorpay_signature,
//       bookingId 
//     } = req.body;

//     // Verify signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
//       .update(body.toString())
//       .digest("hex");

//     const isAuthentic = expectedSignature === razorpay_signature;

//     if (!isAuthentic) {
//       return res.status(400).json({ message: 'Payment verification failed' });
//     }

//     // Update booking
//     const booking = await Booking.findById(bookingId);
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     booking.paymentStatus = 'completed';
//     booking.paymentId = razorpay_payment_id;
//     await booking.save();

//     res.json({ 
//       message: 'Payment successful',
//       booking: booking
//     });
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({ message: 'Payment verification failed' });
//   }
// };

// // Get payment status
// exports.getPaymentStatus = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
    
//     const booking = await Booking.findById(bookingId);
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     res.json({ 
//       paymentStatus: booking.paymentStatus,
//       booking: booking
//     });
//   } catch (error) {
//     console.error('Error getting payment status:', error);
//     res.status(500).json({ message: 'Failed to get payment status' });
//   }
// };


const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/booking');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('roomId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    const options = {
      amount: booking.totalPrice * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId,
        customerName: booking.customerName,
        roomType: booking.roomId ? booking.roomId.title : 'N/A' // Added a check in case roomId is null
      }
    };

    const order = await razorpay.orders.create(options);
    
    // Update booking with order ID
    booking.razorpayOrderId = order.id;
    await booking.save();

    // === MODIFICATION START ===
    // Send the Key ID to the frontend
    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      booking: booking
    });
    // === MODIFICATION END ===

  } catch (error) {
    console.error('Error creating order:', error);
    // Send a more detailed error message for debugging
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId 
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Removed the insecure fallback
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // For security, log the failure but send a generic message to the client
      console.warn(`Tampered payment signature received for bookingId: ${bookingId}`);
      return res.status(400).json({ message: 'Payment verification failed. Signature mismatch.' });
    }

    // Update booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found during verification' });
    }

    booking.paymentStatus = 'completed';
    booking.paymentId = razorpay_payment_id;
    await booking.save();

    console.log(`Payment successful and verified for bookingId: ${bookingId}`);
    res.json({ 
      message: 'Payment successful',
      booking: booking
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Payment verification failed on server', error: error.message });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ 
      paymentStatus: booking.paymentStatus,
      booking: booking
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
};


// /utils/generatePdf.js
const fs = require('fs');
const PDFDocument = require('pdfkit');

const generateBillPdf = async (booking, outputPath) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Header
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .text('HOTEL MANAGEMENT SYSTEM', { align: 'center' });
  
  doc.fontSize(16)
     .font('Helvetica')
     .text('Booking Confirmation & Bill', { align: 'center' });
  
  doc.moveDown(0.5);
  doc.fontSize(10)
     .text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, { align: 'center' });
  
  doc.moveDown(2);

  // Booking Details Section
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('BOOKING DETAILS');
  
  doc.moveDown(0.5);
  doc.fontSize(10)
     .font('Helvetica');

  const details = [
    { label: 'Booking ID', value: booking._id.toString() },
    { label: 'Customer Name', value: booking.customerName },
    { label: 'Phone Number', value: booking.phone },
    { label: 'Number of Persons', value: booking.persons.toString() },
    { label: 'Check-in Date', value: new Date(booking.checkInDate).toLocaleDateString() },
    { label: 'Check-out Date', value: new Date(booking.checkOutDate).toLocaleDateString() },
    { label: 'Payment Status', value: booking.paymentStatus.toUpperCase() },
    { label: 'Booking Status', value: booking.bookingStatus.toUpperCase() }
  ];

  details.forEach(detail => {
    doc.text(`${detail.label}: ${detail.value}`);
  });

  doc.moveDown(2);

  // Payment Details Section
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('PAYMENT DETAILS');
  
  doc.moveDown(0.5);
  doc.fontSize(10)
     .font('Helvetica');

  if (booking.paymentId) {
    doc.text(`Payment ID: ${booking.paymentId}`);
  }
  if (booking.razorpayOrderId) {
    doc.text(`Order ID: ${booking.razorpayOrderId}`);
  }

  // Calculate nights
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  doc.moveDown(1);
  doc.text(`Number of Nights: ${nights}`);
  doc.text(`Total Amount: ₹${booking.totalPrice}`);

  doc.moveDown(2);

  // Terms and Conditions
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('TERMS & CONDITIONS');
  
  doc.moveDown(0.5);
  doc.fontSize(9)
     .font('Helvetica');

  const terms = [
    '• Check-in time: 2:00 PM',
    '• Check-out time: 11:00 AM',
    '• Valid ID proof is required at check-in',
    '• Cancellation policy applies as per hotel terms',
    '• This is a computer generated bill',
    '• Please keep this bill for your records'
  ];

  terms.forEach(term => {
    doc.text(term);
  });

  doc.moveDown(2);

  // Footer
  doc.fontSize(10)
     .font('Helvetica')
     .text('Thank you for choosing our hotel!', { align: 'center' });
  
  doc.moveDown(0.5);
  doc.fontSize(8)
     .text('For any queries, please contact our customer support', { align: 'center' });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(outputPath);
    });
    stream.on('error', reject);
  });
};

module.exports = generateBillPdf;

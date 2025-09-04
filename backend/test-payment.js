// Test script to verify payment integration setup
const Razorpay = require('razorpay');

// Test Razorpay initialization
try {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET'
  });
  
  console.log(' Razorpay initialized successfully');
  console.log('Key ID:', process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID');
  console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? '***SET***' : '***NOT SET***');
  
  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.log('  Warning: RAZORPAY_KEY_SECRET not set in environment variables');
    console.log('   Please set your Razorpay credentials in the .env file');
  }
  
} catch (error) {
  console.error(' Error initializing Razorpay:', error.message);
}

// Test PDF generation
const PDFDocument = require('pdfkit');
try {
  const doc = new PDFDocument();
  console.log(' PDF generation library working');
} catch (error) {
  console.error(' Error with PDF generation:', error.message);
}

console.log('\n Setup Checklist:');
console.log('1.  Razorpay package installed');
console.log('2.  PDF generation library installed');
console.log('3.   Set RAZORPAY_KEY_ID in .env file');
console.log('4.   Set RAZORPAY_KEY_SECRET in .env file');
console.log('5.   Update Razorpay key in frontend/src/pages/Payment.jsx line 58');
console.log('\n  Ready to test payment integration!');

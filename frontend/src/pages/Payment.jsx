// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Payment = () => {
//   const { bookingId } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [paymentLoading, setPaymentLoading] = useState(false);

//   useEffect(() => {
//     loadBooking();
//     loadRazorpayScript();
//   }, [bookingId]);

//   const loadBooking = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
//       setBooking(response.data.booking);
//     } catch (error) {
//       console.error('Error loading booking:', error);
//       alert('Failed to load booking details');
//       navigate('/');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadRazorpayScript = () => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     document.body.appendChild(script);
//   };

//   const handlePayment = async () => {
//     try {
//       setPaymentLoading(true);
      
//       // Create order
//       const orderResponse = await axios.post('http://localhost:5000/api/payments/create-order', {
//         bookingId: bookingId
//       });

//       const { orderId, amount, currency } = orderResponse.data;

//       // Initialize Razorpay
//       const options = {
//         key: 'rzp_test_YOUR_KEY_ID', // Replace with your actual Razorpay key
//         amount: amount,
//         currency: currency,
//         name: 'Hotel Management System',
//         description: `Booking for ${booking.customerName}`,
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             // Verify payment
//             const verifyResponse = await axios.post('http://localhost:5000/api/payments/verify', {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               bookingId: bookingId
//             });

//             // Confirm booking
//             await axios.post(`http://localhost:5000/api/bookings/${bookingId}/confirm-payment`);

//             alert('Payment successful! Your booking has been confirmed.');
//             navigate(`/booking-success/${bookingId}`);
//           } catch (error) {
//             console.error('Payment verification failed:', error);
//             alert('Payment verification failed. Please contact support.');
//           }
//         },
//         prefill: {
//           name: booking.customerName,
//           contact: booking.phone
//         },
//         theme: {
//           color: '#3399cc'
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error('Error initiating payment:', error);
//       alert('Failed to initiate payment. Please try again.');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh',
//         marginTop: '80px'
//       }}>
//         <div>Loading booking details...</div>
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh',
//         marginTop: '80px'
//       }}>
//         <div>Booking not found</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       marginTop: '80px', 
//       padding: '20px',
//       maxWidth: '800px',
//       margin: '80px auto 0',
//       fontFamily: 'Arial, sans-serif'
//     }}>
//       <div style={{
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         padding: '30px',
//         backgroundColor: '#f9f9f9'
//       }}>
//         <h1 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>
//           Payment Details
//         </h1>

//         <div style={{ marginBottom: '30px' }}>
//           <h2 style={{ color: '#555', marginBottom: '20px' }}>Booking Summary</h2>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '20px',
//             borderRadius: '6px',
//             border: '1px solid #e0e0e0'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//               <strong>Customer Name:</strong>
//               <span>{booking.customerName}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//               <strong>Phone:</strong>
//               <span>{booking.phone}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//               <strong>Check-in Date:</strong>
//               <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//               <strong>Check-out Date:</strong>
//               <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//               <strong>Number of Persons:</strong>
//               <span>{booking.persons}</span>
//             </div>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               marginTop: '20px',
//               paddingTop: '15px',
//               borderTop: '2px solid #e0e0e0',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               color: '#2e7d32'
//             }}>
//               <strong>Total Amount:</strong>
//               <span>₹{booking.totalPrice}</span>
//             </div>
//           </div>
//         </div>

//         <div style={{ textAlign: 'center' }}>
//           <button
//             onClick={handlePayment}
//             disabled={paymentLoading}
//             style={{
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               padding: '15px 30px',
//               border: 'none',
//               borderRadius: '6px',
//               fontSize: '16px',
//               cursor: paymentLoading ? 'not-allowed' : 'pointer',
//               opacity: paymentLoading ? 0.7 : 1,
//               minWidth: '200px'
//             }}
//           >
//             {paymentLoading ? 'Processing...' : 'Pay Now'}
//           </button>
//         </div>

//         <div style={{ 
//           marginTop: '20px', 
//           textAlign: 'center',
//           color: '#666',
//           fontSize: '14px'
//         }}>
//           <p>You will be redirected to Razorpay for secure payment processing.</p>
//           <p>Your booking will be confirmed once payment is successful.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;




import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    loadBooking();
    loadRazorpayScript();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Error loading booking:', error);
      alert('Failed to load booking details: ' + (error.response?.data?.message || error.message));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        alert('Failed to load payment gateway. Please refresh and try again.');
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        console.error('Razorpay not loaded');
        alert('Payment gateway not loaded. Please refresh the page and try again.');
        return;
      }

      console.log('Creating order for booking:', bookingId);
      
      // Create order
      const orderResponse = await axios.post('http://localhost:5000/api/payments/create-order', {
        bookingId: bookingId
      });

      console.log('Order created:', orderResponse.data);

      const { orderId, amount, currency } = orderResponse.data;

      // Validate required data
      if (!orderId || !amount) {
        throw new Error('Invalid order data received from server');
      }

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_YOUR_KEY_ID', // ⚠️ REPLACE WITH YOUR ACTUAL RAZORPAY KEY
        amount: amount,
        currency: currency || 'INR',
        name: 'Hotel Management System',
        description: `Hotel Booking - ${booking.customerName}`,
        order_id: orderId,
        handler: async function (response) {
          console.log('Payment successful:', response);
          try {
            // Verify payment
            const verifyResponse = await axios.post('http://localhost:5000/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId
            });

            console.log('Payment verified:', verifyResponse.data);

            // Confirm booking
            await axios.post(`http://localhost:5000/api/bookings/${bookingId}/confirm-payment`);

            alert('Payment successful! Your booking has been confirmed.');
            navigate(`/booking-success/${bookingId}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed: ' + (error.response?.data?.message || error.message));
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed by user');
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: booking.customerName,
          contact: booking.phone || '',
          email: booking.email || ''
        },
        theme: {
          color: '#3399cc'
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      console.log('Initializing Razorpay with options:', options);

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error'}`);
        setPaymentLoading(false);
      });

      rzp.open();
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment: ' + (error.response?.data?.message || error.message));
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        marginTop: '80px'
      }}>
        <div>Loading booking details...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        marginTop: '80px'
      }}>
        <div>Booking not found</div>
      </div>
    );
  }

  return (
    <div style={{ 
      marginTop: '80px', 
      padding: '20px',
      maxWidth: '800px',
      margin: '80px auto 0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '30px',
        backgroundColor: '#f9f9f9'
      }}>
        <h1 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>
          Payment Details
        </h1>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#555', marginBottom: '20px' }}>Booking Summary</h2>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Customer Name:</strong>
              <span>{booking.customerName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Phone:</strong>
              <span>{booking.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Check-in Date:</strong>
              <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Check-out Date:</strong>
              <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Number of Persons:</strong>
              <span>{booking.persons}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '20px',
              paddingTop: '15px',
              borderTop: '2px solid #e0e0e0',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2e7d32'
            }}>
              <strong>Total Amount:</strong>
              <span>₹{booking.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>Debug Info:</strong>
          <br />Booking ID: {bookingId}
          <br />Booking Status: {booking.status || 'N/A'}
          <br />Payment Status: {booking.paymentStatus || 'N/A'}
          <br />Razorpay Loaded: {window.Razorpay ? 'Yes' : 'No'}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            style={{
              backgroundColor: paymentLoading ? '#ccc' : '#4CAF50',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: paymentLoading ? 'not-allowed' : 'pointer',
              minWidth: '200px'
            }}
          >
            {paymentLoading ? 'Processing...' : `Pay ₹${booking.totalPrice}`}
          </button>
        </div>

        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>You will be redirected to Razorpay for secure payment processing.</p>
          <p>Your booking will be confirmed once payment is successful.</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
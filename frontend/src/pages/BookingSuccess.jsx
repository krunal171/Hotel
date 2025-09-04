import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Error loading booking:', error);
      alert('Failed to load booking details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const downloadBill = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}/download-bill`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading bill:', error);
      alert('Failed to download bill. Please try again later.');
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
        backgroundColor: '#f9f9f9',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '40px'
        }}>
          ✓
        </div>

        <h1 style={{ color: '#333', marginBottom: '10px' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Your room has been successfully booked. Payment completed.
        </p>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '6px',
          border: '1px solid #e0e0e0',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h2 style={{ color: '#555', marginBottom: '20px', textAlign: 'center' }}>
            Booking Details
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <strong>Booking ID:</strong>
            <span style={{ fontFamily: 'monospace' }}>{booking._id}</span>
          </div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <strong>Payment Status:</strong>
            <span style={{ 
              color: booking.paymentStatus === 'completed' ? '#4CAF50' : '#f44336',
              fontWeight: 'bold'
            }}>
              {booking.paymentStatus.toUpperCase()}
            </span>
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

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={downloadBill}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📄 Download Bill
          </button>
          
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '15px',
          backgroundColor: '#e8f5e8',
          borderRadius: '6px',
          border: '1px solid #4CAF50'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>Important Information</h3>
          <ul style={{ textAlign: 'left', color: '#555', margin: 0, paddingLeft: '20px' }}>
            <li>Please arrive at the hotel on your check-in date</li>
            <li>Bring a valid ID proof for verification</li>
            <li>Check-in time is 2:00 PM and check-out time is 11:00 AM</li>
            <li>Keep this booking confirmation for your records</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;

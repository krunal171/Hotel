
// src/pages/BookRoom.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookRoom.css';

const BookRoom = () => {
  const { id } = useParams(); // roomId
  const location = useLocation();
  const navigate = useNavigate();

  const { checkIn, checkOut } = location.state || {};
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [idProof, setIdProof] = useState(null);
  const [persons, setPersons] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      navigate('/');
      return;
    }
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
      setRoom(res.data);
      const effectivePrice = res.data.discountPercent && res.data.discountPercent > 0
        ? Math.round(res.data.price * (1 - res.data.discountPercent / 100))
        : res.data.price;
      calculateTotal(effectivePrice);
    } catch (err) {
      console.error('Error fetching room:', err);
      alert('Room not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (pricePerNight) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotalPrice(pricePerNight * nights);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idProof) {
      alert('Please upload ID proof.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('roomId', id);
    formData.append('customerName', customerName);
    formData.append('phone', phone);
    formData.append('idProof', idProof);
    formData.append('persons', persons);
    formData.append('checkInDate', checkIn);
    formData.append('checkOutDate', checkOut);
    formData.append('totalPrice', totalPrice);

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Redirect to payment page with booking ID
      navigate(`/payment/${response.data.booking._id}`);
    } catch (err) {
      console.error('Error booking room:', err);
      alert(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (!room) return null;

  return (
    <div className="book-room-page">
      <div className="br-container">
        <div className="br-header">
          <h1>Book Room: {room.title}</h1>
          <p><strong>Type:</strong> {room.type}</p>
          {room.discountPercent && room.discountPercent > 0 ? (
            <p className="br-price">
              <strong>Price per night:</strong>
              <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '6px' }}>
                ₹{room.price}
              </span>
              <span style={{ marginLeft: '8px', color: '#d32f2f', fontWeight: 'bold' }}>
                ₹{Math.round(room.price * (1 - room.discountPercent / 100))}
              </span>
              <span style={{ marginLeft: '6px', color: '#2e7d32' }}>
                ({room.discountPercent}% OFF)
              </span>
            </p>
          ) : (
            <p className="br-price"><strong>Price per night:</strong> ₹{room.price}</p>
          )}
          <p>
            <strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString()} | 
            <strong> Check-out:</strong> {new Date(checkOut).toLocaleDateString()}
          </p>
          <p><strong>Total Price:</strong> ₹{totalPrice}</p>
        </div>

        <div className="br-card">
          <form onSubmit={handleSubmit} className="br-form">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                className="form-input"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>ID Proof</label>
              <input
                type="file"
                className="form-file"
                accept="image/*,application/pdf"
                onChange={(e) => setIdProof(e.target.files[0])}
                required
              />
            </div>

            <div className="form-group">
              <label>No. of Persons</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={persons}
                onChange={(e) => setPersons(e.target.value)}
                required
              />
            </div>

            <div className="br-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating Booking...' : 'Proceed to Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;

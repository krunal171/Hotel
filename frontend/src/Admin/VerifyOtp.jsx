import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifyOtp.css';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('adminEmail');

  useEffect(() => {
    // Check if admin is already logged in
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin) {
      navigate('/admin-dashboard');
      return;
    }

    // Check if email is available
    if (!email) {
      navigate('/admin-login');
    }
  }, [navigate, email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setMessage('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const res = await axios.post('http://localhost:5000/api/admin/verify-otp', {
        email,
        otp,
      });

      if (res.data.message === 'Login successful') {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1000);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-container">
        <div className="verify-otp-card">
          <div className="verify-otp-header">
            <div className="otp-logo">
              <div className="logo-icon">🔐</div>
              <h1>Verify OTP</h1>
            </div>
            <p>Enter the 6-digit code sent to your email</p>
          </div>

          <div className="email-display">
            <span className="email-label">Email:</span>
            <span className="email-value">{email}</span>
          </div>

          <form onSubmit={handleVerify} className="verify-otp-form">
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                className="form-input otp-input"
                required
              />
            </div>

            <button 
              type="submit"
              className="btn btn-primary verify-btn"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          {message && (
            <div className={`otp-message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="verify-otp-footer">
            <button 
              onClick={() => navigate('/admin-login')}
              className="btn btn-outline back-btn"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

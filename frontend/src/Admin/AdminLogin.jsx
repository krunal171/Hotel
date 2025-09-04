import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin) {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      await axios.post('http://localhost:5000/api/admin/send-otp', { email });
      setMessage('OTP sent successfully to your email');
      localStorage.setItem('adminEmail', email);
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to send OTP';
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo">
              <div className="logo-icon">🏨</div>
              <h1>Admin Login</h1>
            </div>
            <p>Enter your email to receive OTP for admin access</p>
          </div>

          <form onSubmit={handleSendOtp} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                name="adminEmail"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary admin-login-btn"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          {message && (
            <div className={`admin-message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="admin-login-footer">
            <p>Need help? Contact system administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

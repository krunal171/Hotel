import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    feedback: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (message) setMessage('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return 'Enter a valid email';
    if (!form.phone.trim()) return 'Phone number is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.country.trim()) return 'Country is required';
    if (!form.feedback.trim()) return 'Feedback is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/contact', form);
      setMessage(res.data?.message || 'Thank you! We have received your message.');
      setForm({ name: '', email: '', phone: '', city: '', country: '', feedback: '' });
    } catch (e) {
      setError(e.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have questions? Send us a message and we'll get back to you soon.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>We're here to help and answer any question you might have. We look forward to hearing from you.</p>
            
            <div className="contact-details">
              <div className="contact-detail">
                <span className="contact-icon"><FiMapPin /></span>
                <div>
                  <h3>Address</h3>
                  <p>123 Main Street<br />City Center, 12345</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <span className="contact-icon"><FiPhone /></span>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <span className="contact-icon"><FiMail /></span>
                <div>
                  <h3>Email</h3>
                  <p>info@vivanhotel.com</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <span className="contact-icon"><FiClock /></span>
                <div>
                  <h3>Hours</h3>
                  <p>24/7 Customer Service</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            
            {error && (
              <div className="alert alert-error">{error}</div>
            )}
            {message && (
              <div className="alert alert-success">{message}</div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    className="form-input"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    className="form-input"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    className="form-input"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange} 
                    className="form-input"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Country</label>
                <input 
                  type="text" 
                  name="country" 
                  value={form.country} 
                  onChange={handleChange} 
                  className="form-input"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  name="feedback" 
                  value={form.feedback} 
                  onChange={handleChange} 
                  rows={5} 
                  className="form-input"
                  placeholder="Tell us how we can help you..."
                  required 
                />
              </div>
              
              <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

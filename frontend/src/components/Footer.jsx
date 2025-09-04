import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Hotel Info */}
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="footer-logo">Vivan Hotel</h3>
              <p className="footer-tagline">Your Perfect Stay</p>
            </div>
            <p className="footer-description">
              Experience comfort and convenience at Vivan Hotel. 
              We provide quality accommodations and excellent service 
              to make your stay memorable.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">Facebook</a>
              <a href="#" className="social-link" aria-label="Instagram">Instagram</a>
              <a href="#" className="social-link" aria-label="Twitter">Twitter</a>
              <a href="#" className="social-link" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/help" className="footer-link">Help</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-title">Our Services</h4>
            <ul className="footer-links">
              <li><span className="footer-link">Room Booking</span></li>
              <li><span className="footer-link">Restaurant</span></li>
              <li><span className="footer-link">Swimming Pool</span></li>
              <li><span className="footer-link">Spa & Wellness</span></li>
              <li><span className="footer-link">Parking</span></li>
              <li><span className="footer-link">Airport Shuttle</span></li>
            </ul>
          </div>

          {/* Contact Info (Right Column) */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon"><FiMapPin /></span>
                <span>123 Main Street, City Center, 12345</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon"><FiPhone /></span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon"><FiMail /></span>
                <span>info@vivanhotel.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon"><FiClock /></span>
                <span>24/7 Customer Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} Vivan Hotel. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
              <Link to="/cookies" className="footer-bottom-link">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

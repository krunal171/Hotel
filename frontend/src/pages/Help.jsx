import React, { useState } from 'react';
import './Help.css';
import { FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi';

const Help = () => {
  const [activeSection, setActiveSection] = useState('booking');

  const faqData = {
    booking: [
      {
        question: "How do I make a reservation?",
        answer: "You can make a reservation by selecting your check-in and check-out dates on our homepage, then choosing from available rooms. Click 'Book Now' to proceed with your booking."
      },
      {
        question: "Can I modify or cancel my reservation?",
        answer: "Yes, you can modify or cancel your reservation by contacting our customer service team at least 24 hours before your check-in date. Cancellation policies may apply."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. Payment is required at the time of booking."
      },
      {
        question: "Do you offer group discounts?",
        answer: "Yes, we offer special rates for group bookings of 10 or more rooms. Please contact our sales team for group booking inquiries and custom packages."
      }
    ],
    checkin: [
      {
        question: "What time is check-in and check-out?",
        answer: "Check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability."
      },
      {
        question: "What do I need to bring for check-in?",
        answer: "Please bring a valid government-issued photo ID and the credit card used for booking. We may also require a security deposit upon arrival."
      },
      {
        question: "Can I check in early?",
        answer: "Early check-in is subject to room availability. Please contact us in advance to request early check-in. Additional charges may apply."
      },
      {
        question: "What if I arrive late?",
        answer: "If you're arriving after 11:00 PM, please inform us in advance. We have 24-hour front desk service, so late arrivals are accommodated."
      }
    ],
    amenities: [
      {
        question: "What amenities are included?",
        answer: "All rooms include free WiFi, air conditioning, flat-screen TV, mini-fridge, coffee maker, and daily housekeeping. Premium rooms may include additional amenities."
      },
      {
        question: "Do you have a restaurant?",
        answer: "Yes, we have an on-site restaurant serving breakfast, lunch, and dinner. Room service is also available during restaurant hours."
      },
      {
        question: "Is parking available?",
        answer: "Complimentary parking is available for all guests. Valet parking service is also available for an additional fee."
      },
      {
        question: "Do you have a fitness center?",
        answer: "Yes, we have a fully equipped fitness center open 24/7 for all guests. We also offer spa services and a swimming pool."
      }
    ],
    policies: [
      {
        question: "What is your cancellation policy?",
        answer: "Cancellations made 24 hours or more before check-in are free. Cancellations made within 24 hours of check-in will be charged one night's room rate."
      },
      {
        question: "Do you allow pets?",
        answer: "We are a pet-friendly hotel. Pets are welcome with advance notice and may be subject to additional fees and restrictions."
      },
      {
        question: "What is your smoking policy?",
        answer: "All rooms and indoor areas are non-smoking. Designated smoking areas are available outside the hotel building."
      },
      {
        question: "Do you offer accessibility features?",
        answer: "Yes, we have accessible rooms and facilities for guests with disabilities. Please inform us of any special requirements when booking."
      }
    ]
  };

  return (
    <div className="help-page">
      <div className="help-container">
        <div className="help-header">
          <h1>Help & Support</h1>
          <p>Find answers to common questions or contact our support team</p>
        </div>

        <div className="help-content">
          <div className="help-sidebar">
            <h3>Quick Links</h3>
            <ul className="help-nav">
              <li>
                <button 
                  className={activeSection === 'booking' ? 'active' : ''}
                  onClick={() => setActiveSection('booking')}
                >
                  Booking & Reservations
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'checkin' ? 'active' : ''}
                  onClick={() => setActiveSection('checkin')}
                >
                  Check-in & Check-out
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'amenities' ? 'active' : ''}
                  onClick={() => setActiveSection('amenities')}
                >
                  Amenities & Services
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'policies' ? 'active' : ''}
                  onClick={() => setActiveSection('policies')}
                >
                  Hotel Policies
                </button>
              </li>
            </ul>

            <div className="contact-support">
              <h3>Still Need Help?</h3>
              <p>Contact our support team</p>
              <div className="contact-methods">
                <div className="contact-method">
                  <span className="contact-icon"><FiPhone /></span>
                  <div>
                    <strong>Phone</strong>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon"><FiMail /></span>
                  <div>
                    <strong>Email</strong>
                    <p>support@vivanhotel.com</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon"><FiMessageCircle /></span>
                  <div>
                    <strong>Live Chat</strong>
                    <p>Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="help-main">
            <div className="faq-section">
              <h2>
                {activeSection === 'booking' && 'Booking & Reservations'}
                {activeSection === 'checkin' && 'Check-in & Check-out'}
                {activeSection === 'amenities' && 'Amenities & Services'}
                {activeSection === 'policies' && 'Hotel Policies'}
              </h2>
              
              <div className="faq-list">
                {faqData[activeSection].map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4 className="faq-question">{faq.question}</h4>
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
);
};

export default Help;

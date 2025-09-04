// import React from 'react';

// const About = () => (
//   <div style={{ padding: '20px' ,marginTop: '60px'}}>
//     <h2>About Us</h2>
//     <p>We provide comfortable and affordable rooms for your stay.</p>
//   </div>
// );

// export default About;


import React from 'react';
import { FaHotel, FaUsers, FaStar, FaLeaf } from 'react-icons/fa';
import './About.css';

const AboutUs = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1>About Vivan Hotel</h1>
          <p>Your Gateway to Luxury and Comfort</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container content-section">
        
        {/* Introduction */}
        <div className="intro-section">
          <h2>Welcome to Vivan Hotel</h2>
          <p>
            Welcome to <strong>Vivan Hotel</strong>, your premier destination for luxury hospitality and unparalleled comfort. 
            Situated in a prime location, our hotel offers a perfect blend of modern elegance and warm, personalized service 
            that creates unforgettable experiences for every guest.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <FaHotel className="feature-icon" style={{color: '#2563eb'}} />
            <h3>Luxury Rooms</h3>
            <p>Exquisite rooms and suites designed for your comfort</p>
          </div>
          
          <div className="feature-card">
            <FaUsers className="feature-icon" style={{color: '#059669'}} />
            <h3>Exceptional Service</h3>
            <p>Personalized attention from our dedicated staff</p>
          </div>
          
          <div className="feature-card">
            <FaStar className="feature-icon" style={{color: '#d97706'}} />
            <h3>5-Star Experience</h3>
            <p>World-class amenities and dining options</p>
          </div>
          
          <div className="feature-card">
            <FaLeaf className="feature-icon" style={{color: '#059669'}} />
            <h3>Eco-Friendly</h3>
            <p>Committed to sustainability and environmental care</p>
          </div>
        </div>

        {/* Our Story */}
        <div className="story-section">
          <h2>Our Story</h2>
          <div className="story-grid">
            <div>
              <p>
                At Vivan Hotel, we pride ourselves on creating memorable experiences for every guest. 
                Our journey began with a simple vision: to provide a home away from home where luxury 
                meets comfort and exceptional service is the standard.
              </p>
              <p>
                Our exquisite rooms and suites are thoughtfully designed with your comfort in mind, 
                equipped with all the modern amenities you need for a relaxing and productive stay.
              </p>
            </div>
            <div>
              <p>
                Enjoy our diverse dining options featuring local and international cuisine prepared 
                by world-class chefs. For relaxation, indulge in our spa and wellness center, 
                or take a refreshing dip in our pristine pool.
              </p>
              <p>
                Whether you are here for business or leisure, Vivan Hotel ensures a safe, 
                welcoming environment with exceptional service that makes you feel right at home.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mission-values-grid">
          
          {/* Mission */}
          <div className="mission-card">
            <h2>Our Mission</h2>
            <p>
              To provide unmatched hospitality experiences by combining luxury, comfort, 
              and impeccable service, making every stay unforgettable. We strive to exceed 
              expectations and create lasting memories for all our guests.
            </p>
          </div>

          {/* Values */}
          <div className="values-card">
            <h2>Our Values</h2>
            <ul className="values-list">
              <li>Commitment to Excellence in Service</li>
              <li>Respect and Care for Our Guests</li>
              <li>Integrity and Transparency</li>
              <li>Innovation in Hospitality</li>
              <li>Sustainability and Environmental Responsibility</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <h2>Experience Vivan Hotel</h2>
          <p>
            Book your stay today and discover why guests choose us for unforgettable experiences.
          </p>
          <button className="cta-button" onClick={() => window.location.href = '/'}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

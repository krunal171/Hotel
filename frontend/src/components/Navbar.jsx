// import React from 'react';
// import { Link } from 'react-router-dom';
// import logo from '../images/image.png';
// const Navbar = () => {
//   return (
//     <nav style={styles.nav}>
//       <div style={styles.brand}>
//         <img
//           src={logo}
//           alt="Vivan Hotel"
//           style={{ height: '80px', marginLeft: '40px' }}
//         />
//       </div>
//       {/* <th style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginLeft: '20px' }}>hotel</th> */}
//       <ul style={styles.ul}>
        
//         <li><Link to="/" style={styles.link}>Home</Link></li>
//         <li><Link to="/about" style={styles.link}>About Us</Link></li>
//         <li><Link to="/contact" style={styles.link}>Contact Us</Link></li>
//         <li><Link to="/help" style={styles.link}>Help</Link></li>
//         <li><Link to="/admin-login" style={styles.link}><strong>Admin Login</strong></Link></li>
//       </ul>
//     </nav>
//   );
// };

// const styles = {
//   nav: {
//     backgroundColor: '#333',
//     padding: '10px 10px',
//   },
//   li:{
//     padding: '0 15px',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: '18px',
//     margintop: '0px',
//   },
//   ul: {
//     listStyle: 'none',
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '20px',
//     margin: 0,
//     padding: 0
//   },
//   link: {
//     color: 'white',
//     textDecoration: 'none',
//     fontWeight: '500'
//   }
// };

// export default Navbar;




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/image.png';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <div className="navbar-logo">
              <div className="logo-icon">🏨</div>
            </div>
            <div className="brand-text">
              <h3 className="brand-name">Vivan Hotel</h3>
              <p className="brand-tagline">Your Perfect Stay</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link">About</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">Contact</Link>
          </li>
          <li className="navbar-item">
            <Link to="/help" className="navbar-link">Help</Link>
          </li>
          <li className="navbar-item">
            <Link to="/admin-login" className="navbar-link admin-link">Login</Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-navbar-menu">
          <li className="mobile-navbar-item">
            <Link to="/" className="mobile-navbar-link" onClick={toggleMenu}>Home</Link>
          </li>
          <li className="mobile-navbar-item">
            <Link to="/about" className="mobile-navbar-link" onClick={toggleMenu}>About</Link>
          </li>
          <li className="mobile-navbar-item">
            <Link to="/contact" className="mobile-navbar-link" onClick={toggleMenu}>Contact</Link>
          </li>
          <li className="mobile-navbar-item">
            <Link to="/help" className="mobile-navbar-link" onClick={toggleMenu}>Help</Link>
          </li>
          <li className="mobile-navbar-item">
            <Link to="/admin-login" className="mobile-navbar-link admin-link" onClick={toggleMenu}>Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

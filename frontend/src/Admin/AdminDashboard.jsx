// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const AdminDashboard = () => {
//     const admin = JSON.parse(localStorage.getItem('admin')); // from login
//   const navigate = useNavigate();
//   const email = admin?.email;

//   const handleLogout = () => {
//        localStorage.removeItem('admin');
//     localStorage.removeItem('adminEmail');
//     navigate('/'); // redirect to login
//   };

//   // if (!email) {
//   //   return <p>Unauthorized access. Please login.</p>;
//   // }

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Welcome, {email}</h2>
//       <button 
//           onClick={handleLogout}
//           style={{
//             backgroundColor: '#dc3545',
//             color: 'white',
//             border: 'none',
//             padding: '10px 20px',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontWeight: 'bold'
//           }}
//         >
//           Logout
//         </button>
//        <br /><br />
//       {/* Add admin dashboard features below */}
//       <button onClick={() => navigate('/admin/login')}>Manage Rooms</button>

     
//     </div>
//   );
// };

// export default AdminDashboard;




// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// // import AdminSidebar from "../../components/AdminSidebar";
// import AdminSidebar from "../components/AdminSidebar";



// const AdminDashboard = () => {
//   const admin = JSON.parse(localStorage.getItem('admin') || '{}'); // safe parse
//   const navigate = useNavigate();
//   const email = admin?.email;

//   const handleLogout = () => {
//     localStorage.removeItem('admin');
//     localStorage.removeItem('adminEmail');
//     navigate('/'); // redirect to login
//   };

//   if (!email) {
//     return <p>Unauthorized access. Please login.</p>;
//   }

//   return (
    
  

//     <div style={{ display: 'flex' }} >
//       <AdminSidebar />
//       <div style={{ marginLeft: '280px', padding: '20px', width: '100%', marginTop: '60px' }}>
//         <h1>Welcome to Admin Dashboard</h1>
//         <p>Here you can manage rooms, bookings, and other admin tasks.</p>
//       </div>
//     </div>
 

//   );
// };

// export default AdminDashboard;




import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const admin = JSON.parse(localStorage.getItem('admin') || '{}'); // safe parse
  const navigate = useNavigate();
  const email = admin?.email;

  const [roomCount, setRoomCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login'); // go to login page
  };

  useEffect(() => {
    if (!email) return;

    const fetchCounts = async () => {
      try {
        const roomsRes = await axios.get('http://localhost:5000/api/rooms/count');
        // const bookingsRes = await axios.get('http://localhost:5000/api/bookings/count');
        setRoomCount(roomsRes.data.count || 0);
        // setBookingCount(bookingsRes.data.count || 0);
      } catch (err) {
        console.error('Error fetching counts:', err);
      }
    };

    fetchCounts();
  }, [email]);

  if (!email) {
    return (
      <div className="unauthorized-access">
        <div className="unauthorized-card">
          <h2>Unauthorized Access</h2>
          <p>Please login to access the admin dashboard.</p>
          <button onClick={() => navigate('/admin-login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="admin-header">
          <div className="admin-welcome">
            <h1 style={{marginTop:'50px'}}>Welcome to Admin Dashboard</h1>
            <p>Manage your hotel operations efficiently</p>
          </div>
          <div style={{marginTop:'50px'}} className="admin-user-info">
            <span className="admin-email">{email}</span>
            <button onClick={handleLogout} className="btn btn-outline logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">🏨</div>
            <div className="stat-content">
              <h3>Total Rooms</h3>
              <p className="stat-number">{roomCount}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Total Bookings</h3>
              <p className="stat-number">{bookingCount}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenue</h3>
              <p className="stat-number">$0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Guests</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/admin/rooms/add')} className="btn btn-primary">
              Add New Room
            </button>
            <button onClick={() => navigate('/admin/rooms')} className="btn btn-outline">
              Manage Rooms
            </button>
            <button onClick={() => navigate('/admin/manage-bookings')} className="btn btn-outline">
              View Bookings
            </button>
            <button onClick={() => navigate('/admin/facilities')} className="btn btn-outline">
              Manage Facilities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

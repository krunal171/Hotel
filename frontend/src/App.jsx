// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Navbar from './components/Navbar';
// import ProtectedRoute from './components/ProtectedRoute';
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Help from './pages/Help';
// import AdminLogin from './Admin/AdminLogin';
// import VerifyOtp from './Admin/VerifyOtp';
// import AdminDashboard from './Admin/AdminDashboard';
// import RoomManagement from './Admin/RoomManagement';
// import AddRoom from './Admin/AddRoom';
// import EditRoom from './Admin/EditRoom';
// import RoomDetails from './pages/RoomDetails';
// import BookRoom from './pages/BookRoom';

// const App = () => {
//   return (
//     <Router>
//       <Navbar /> {/* Always show */}
      
//         <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/rooms/:id" element={<RoomDetails />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/help" element={<Help />} />
//         <Route path="/admin-login" element={<AdminLogin />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />
//         <Route path="/book-room/:id" element={<BookRoom />} />
//         {/* <Route path="/book-now/:id" element={<BookNow />} /> */}
//         {/* Protected Admin Routes */}
//         <Route path="/admin-dashboard" element={
//           <ProtectedRoute>
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/rooms" element={
//           <ProtectedRoute>
//             <RoomManagement />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/rooms/add" element={
//           <ProtectedRoute>
//             <AddRoom />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/rooms/edit/:id" element={
//           <ProtectedRoute>
//             <EditRoom />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/manage-admin" element={
//         <ProtectedRoute>
//           <ManageAdmin />
//         </ProtectedRoute>
//       } />
//       </Routes>
      
//     </Router>
//   );
// };

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import AdminLogin from './Admin/AdminLogin';
import VerifyOtp from './Admin/VerifyOtp';
import AdminDashboard from './Admin/AdminDashboard';
import RoomManagement from './Admin/RoomManagement';
import AddRoom from './Admin/AddRoom';
import EditRoom from './Admin/EditRoom';
import ManageAdmin from './Admin/ManageAdmin'; // Added missing import
import RoomDetails from './pages/RoomDetails';
import BookRoom from './pages/BookRoom';
import Payment from './pages/Payment';
import BookingSuccess from './pages/BookingSuccess';
import AddAdmin from './Admin/AddAdmin'; // Importing AddAdmin component
import ManageBooking from './Admin/booking/ManageBooking'; // Importing ManageBooking component
import ManageFacilities from './Admin/ManageFacilities'; // Importing ManageFacilities component

const AppContent = () => {
  const location = useLocation();
  const pathname = location.pathname || '';
  const isAdminUi = pathname.startsWith('/admin-dashboard') || pathname.startsWith('/admin/');

  return (
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/book-room/:id" element={<BookRoom />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/booking-success/:bookingId" element={<BookingSuccess />} />
            <Route path="/admin/manage-bookings" element={<ManageBooking />} />
            <Route path="/admin/facilities" element={<ManageFacilities />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/rooms" element={
              <ProtectedRoute>
                <RoomManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/rooms/add" element={
              <ProtectedRoute>
                <AddRoom />
              </ProtectedRoute>
            } />
            <Route path="/admin/rooms/edit/:id" element={
              <ProtectedRoute>
                <EditRoom />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-admins/:id" element={
              <ProtectedRoute>
                <ManageAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-admin" element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        {!isAdminUi && <Footer />}
      </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
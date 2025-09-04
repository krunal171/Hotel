import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const navigate = useNavigate();
  const email = admin?.email;
  const isMaster = admin?.isMaster || false; //  check master flag

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminEmail");
    navigate("/");
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">⚙️</div>
          <h2>Admin Panel</h2>
        </div>
        <p className="admin-email">{email}</p>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-btn" onClick={() => navigate("/admin-dashboard")}>
          <span className="nav-icon">📊</span>
          Dashboard
        </button>
        <button className="nav-btn" onClick={() => navigate("/admin/rooms")}>
          <span className="nav-icon">🏨</span>
          Manage Rooms
        </button>
        <button className="nav-btn" onClick={() => navigate("/admin/facilities")}>
          <span className="nav-icon">🏊</span>
          Manage Facilities
        </button>
        <button className="nav-btn" onClick={() => navigate("/admin/manage-bookings")}>
          <span className="nav-icon">📅</span>
          Manage Bookings
        </button>

        {isMaster && (
          <button className="nav-btn" onClick={() => navigate(`/admin/manage-admins/${admin._id}`)}>
            <span className="nav-icon">👥</span>
            Manage Admins
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => { handleLogout(); navigate("/admin-login"); }}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

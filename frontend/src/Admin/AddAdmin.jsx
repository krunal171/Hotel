import React, { useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import './AddAdmin.css';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    isMaster: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const getCurrentAdmin = () => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        return JSON.parse(adminData);
      } catch (err) {
        return null;
      }
    }
    return null;
  };

  const currentAdmin = getCurrentAdmin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (formData.isMaster === '') {
      setError('Please select if admin is master or not');
      return;
    }

    if (!currentAdmin || !currentAdmin._id) {
      setError('You must be logged in as a master admin');
      return;
    }

    if (!currentAdmin.isMaster) {
      setError('Only master admins can add new admins');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        isMaster: formData.isMaster === 'true', // Convert string to boolean
        requesterId: currentAdmin._id
      };

      console.log('Sending payload:', payload);

      await axios.post('http://localhost:5000/api/admin/add-admin', payload);
      
      setSuccess('Admin added successfully!');
      setFormData({ email: '', isMaster: '' }); // Reset form
      
    } catch (err) {
      console.error('Add admin error:', err);
      setError(err.response?.data?.message || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authorized
  if (!currentAdmin) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
        <div className="text-red-600 text-center">
          Please login first to access this page.
        </div>
      </div>
    );
  }

  if (!currentAdmin.isMaster) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
        <div className="text-yellow-600 text-center">
          Only master admins can add new admins.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }} className="add-admin-page">
      <AdminSidebar />
      <div className="add-admin-content">
        <div className="card">
          <h1 className="card-title">Add New Admin</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input"
                placeholder="Enter admin email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="isMaster" className="form-label">Admin Type *</label>
              <select
                id="isMaster"
                name="isMaster"
                value={formData.isMaster}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select"
              >
                <option value="">-- Select Admin Type --</option>
                <option value="true">Master Admin</option>
                <option value="false">Regular Admin</option>
              </select>
            </div>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            {success && (
              <div className="alert alert-success">{success}</div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
              {loading ? 'Adding Admin...' : 'Add Admin'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 current-user">
            Logged in as: <strong>{currentAdmin.email}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;

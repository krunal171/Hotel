import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './AddRoom.css';
import { useEffect } from 'react';

const AddRoom = () => {
  const [form, setForm] = useState({
    title: '',
    type: '',
    price: '',
    description: '',
    discountPercent: ''
  });

  const [image1, setImage1] = useState(null); // Required
  const [image2, setImage2] = useState(null); // Optional
  const [image3, setImage3] = useState(null); // Optional
  const [facilities, setFacilities] = useState([]); //  All facilities from DB
  const [selectedFacilities, setSelectedFacilities] = useState([]); //  Selected ones
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

   //  Fetch facilities on load
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/facilities');
        setFacilities(res.data);
      } catch (err) {
        console.error('Error fetching facilities:', err);
      }
    };
    fetchFacilities();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.type) return 'Please select a room type';
    if (!form.price || Number(form.price) <= 0) return 'Please enter a valid price';
    if (!form.description.trim()) return 'Description is required';
    if (form.discountPercent !== '' && (Number(form.discountPercent) < 0 || Number(form.discountPercent) > 100)) return 'Discount must be between 0 and 100';
    if (!image1) return 'Thumbnail image is required';
    return null;
  };

  //  Facility checkbox toggle
  const handleFacilityToggle = (id) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('type', form.type);
      formData.append('price', form.price);
      if (form.discountPercent !== '') formData.append('discountPercent', form.discountPercent);
      formData.append('description', form.description.trim());

       //  Add selected facilities
      selectedFacilities.forEach((id) => {
        formData.append('facilities', id);
      });

      // Append only if file is selected
      if (image1) formData.append('images', image1);
      if (image2) formData.append('images', image2);
      if (image3) formData.append('images', image3);

      console.log('Submitting formData keys:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // DO NOT set Content-Type header manually. Let axios handle it.
      const res = await axios.post('http://localhost:5000/api/rooms', formData);
      
      console.log('Server response:', res.data);
      navigate('/admin/rooms');

    } catch (err) {
      console.error('Failed to add room:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }} className="add-room-page">
      <AdminSidebar />
      <div className="add-room-content" style={{ alignItems: 'center', width: '100%' ,margin:'50px'}}>
        {/* <h2>Room Management</h2> */}
    <div className="form-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="form-title">Add New Room</h2>

      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#ffe6e6',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div className="form-group">
      <label>Room Title</label>
      <input className="form-input"
        name="title"
        placeholder="Enter Room Title"
        value={form.title}
        onChange={handleChange}
      />
      </div>

      <div className="form-group">
      <label>Room Type</label>
      <select className="form-select" name="type" value={form.type} onChange={handleChange}>
        <option value="">Select Type</option>
        <option value="1BHK">1BHK</option>
        <option value="2BHK">2BHK</option>
        <option value="3BHK">3BHK</option>
      </select>
      </div>

      <div className="form-group">
      <label>Price</label>
      <input className="form-input"
        type="number"
        name="price"
        placeholder="Price per day"
        value={form.price}
        onChange={handleChange}
      />
      </div>

      <div className="form-group">
      <label>Discount (%)</label>
      <input className="form-input"
        type="number"
        name="discountPercent"
        placeholder="0-100"
        min="0"
        max="100"
        value={form.discountPercent}
        onChange={handleChange}
      />
      </div>

      <div className="form-group">
      <label>Thumbnail Image (Required)</label>
      <input className="form-file" type="file" accept="image/*" onChange={(e) => setImage1(e.target.files[0])} />
      </div>

      <div className="form-group">
      <label>Second Image (Optional)</label>
      <input className="form-file" type="file" accept="image/*" onChange={(e) => setImage2(e.target.files[0])} />
      </div>

      <div className="form-group">
      <label>Third Image (Optional)</label>
      <input className="form-file" type="file" accept="image/*" onChange={(e) => setImage3(e.target.files[0])} />
      </div>

       {/* ✅ Facilities selection */}
          <h3>Select Facilities</h3>
          {facilities.length === 0 ? (
            <p>No facilities available</p>
          ) : (
            <div className="facilities-list">
              {facilities.map((f) => (
                <label key={f._id}>
                  <input
                    type="checkbox"
                    checked={selectedFacilities.includes(f._id)}
                    onChange={() => handleFacilityToggle(f._id)}
                  />
                  <span style={{ marginLeft: '8px' }}>{f.name}</span>
                </label>
              ))}
            </div>
          )}
          <br />

      <div className="form-group">
      <label>Description</label>
      <textarea className="form-textarea"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      </div>

      <div className="form-actions">
        <button onClick={handleSubmit}  className="btn btn-outline back-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Room'}
        </button>
        <button onClick={() => navigate(-1)}style={{backgroundColor: '#6c757d', color: 'white', margin: '10px', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '15px'}} className="btn btn-outline back-btn">← Back</button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AddRoom;

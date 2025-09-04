// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// // import { useParams } from 'react-router-dom';
// import { useNavigate, useParams } from 'react-router-dom';


// const EditRoom = () => {
//   const { id } = useParams();
//   const [form, setForm] = useState({ title: '', type: '', description: '', price: '' });
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/rooms`)
//       .then(res => {
//         const room = res.data.find(r => r._id === id);
//         setForm(room);
//       });
//   }, [id]);

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleFileChange = e => setImages(e.target.files);

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const formData = new FormData();
//     for (let key in form) formData.append(key, form[key]);
//     for (let file of images) formData.append('images', file);

//     try {
//       await axios.put(`http://localhost:5000/api/rooms/${id}`, formData);
//       alert('Room updated');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Edit Room</h2>
//       <input name="title" value={form.title} onChange={handleChange} required /><br />
//       <input name="type" value={form.type} onChange={handleChange} required /><br />
//       <input name="price" value={form.price} onChange={handleChange} required /><br />
//       <textarea name="description" value={form.description} onChange={handleChange} required /><br />
//       <input type="file" multiple accept="image/*" onChange={handleFileChange} /><br />
//       <button type="submit">Update Room</button>
//     </form>
//   );
// };

// export default EditRoom;





// src/pages/EditRoom.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './EditRoom.css';
const EditRoom = () => {
  const { id } = useParams(); // room ID from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    type: '',
    price: '',
    description: '',
    discountPercent: ''
  });

  const [image1, setImage1] = useState(null); // new thumbnail
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // old images from DB

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/rooms`)
      .then(res => {
        const room = res.data.find(r => r._id === id);
        setForm(room);
      });
  }, [id]);

  // Fetch existing room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        const room = res.data;
        setForm({
          title: room.title,
          type: room.type,
          price: room.price,
          description: room.description,
          discountPercent: room.discountPercent ?? ''
        });
        setExistingImages(room.images || []); // array of image paths from backend
      } catch (err) {
        console.error('Failed to fetch room:', err);
        setError('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

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
    // thumbnail not required on edit unless you want to force update
    return null;
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

      // Only append if new files selected
      if (image1) formData.append('images', image1);
      if (image2) formData.append('images', image2);
      if (image3) formData.append('images', image3);

      await axios.put(`http://localhost:5000/api/rooms/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/admin/rooms');
    } catch (err) {
      console.error('Failed to update room:', err);
      setError(err.response?.data?.message || 'Failed to update room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.title) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex' }} className="edit-room-page">
      <AdminSidebar />
      <div className="edit-room-content">
        <h2>Room Management</h2>
        <div className="form-card">
          <h2 className="form-title">Edit Room</h2>

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

          <label>Current Images</label>
          <div className="image-list">
            {existingImages.length > 0 ? (
              existingImages.map((img, i) => (
                <img className="image-thumb"
                  key={i}
                  src={`http://localhost:5000/${img}`}
                  alt={`Room ${i + 1}`}
                  onError={(e) => e.target.src = 'https://placehold.co/80x80?text=No+Image'}
                />
              ))
            ) : (
              <span>No images</span>
            )}
          </div>

          <div className="form-group">
          <label>Replace Thumbnail (Optional)</label>
          <input className="form-file" type="file" accept="image/*" onChange={(e) => setImage1(e.target.files[0])} />
          </div>

          <div className="form-group">
          <label>Replace Second Image (Optional)</label>
          <input className="form-file" type="file" accept="image/*" onChange={(e) => setImage2(e.target.files[0])} />
          </div>

          <div className="form-group">
          <label>Replace Third Image (Optional)</label>
          <input className="form-file" type="file" accept="image/*" onChange={(e) => setImage3(e.target.files[0])} />
          </div>

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
            <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Room'}
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-outline">← Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoom;

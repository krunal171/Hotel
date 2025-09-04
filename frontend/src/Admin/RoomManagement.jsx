// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit, FaTrash } from "react-icons/fa";
// import AdminSidebar from "../components/AdminSidebar";


// const RoomManagement = () => {
//   const [rooms, setRooms] = useState([]);
//    const [facilities, setFacilities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const admin = JSON.parse(localStorage.getItem('admin'));

//   useEffect(() => {
//     // if (!admin) {
//     //   navigate('/admin-login');
//     //   return;
//     // }
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/rooms');
//       setRooms(res.data);
//     } catch (error) {
//       console.error('Error fetching rooms:', error);
//     }
//   };
//   const fetchFacilities = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/facilities');
//       setFacilities(res.data);
//     } catch (error) {
//       console.error('Error fetching facilities:', error);
//     }
//   };

 
//   const deleteRoom = async (id) => {
//     if (window.confirm('Are you sure you want to delete this room?')) {
//       try {
//         await axios.delete(`http://localhost:5000/api/rooms/${id}`);
//         fetchRooms(); // Refresh list
//       } catch (err) {
//         console.error('Delete failed');
//         alert('Failed to delete room');
//       }
//     }
//   };

//   // if (loading) {
//   //   return <div style={{ padding: '20px', textAlign: 'center' }}>Loading rooms...</div>;
//   // }
// // helper: get facility names from IDs
//   const getFacilityNames = (facilityIds = []) => {
//     return facilities
//       .filter(f => facilityIds.includes(f._id))
//       .map(f => f.name); // assuming facility has `name` field
//   };
//   return (

//     // <div style={{ display: 'flex' }}>
//     //   <AdminSidebar />
//     //   <div style={{ padding: '20px' , alignItems: 'center', width: '100%' }}>
//     <div style={{ display: 'flex' }}>
//       <AdminSidebar />
//       <div style={{ marginLeft: '280px', padding: '20px', width: '100%', marginTop: '60px' }}>

//         <h2>Room Management</h2>

//         <button onClick={() => navigate('/admin/rooms/add')}>Add New Room</button>

//         <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Type</th>
//               <th>Price</th>
//               <th>Images</th>
//               <th>Description</th>
//               <th>Facilities</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rooms.map(room => (
//               <tr key={room._id} style={{ borderBottom: '1px solid #eee' }}>
//                 <td >{room.title}</td>
//                 <td >{room.type}</td>
//                 <td >₹{room.price}</td>
//                 <td >
//                   <div style={{ display: 'flex', gap: '5px', border: '1px solid #080000ff', padding: '30px' }}>

//                     {/* <td>
//                 {room.images?.map((img, idx) => (
//                   <img key={idx} src={img} alt="room" width="50" />
//                 ))}
//               </td> */}
//                     {room.image1 && (
//                       <img
//                         src={`http://localhost:5000/uploads/${room.image1}`}
//                         alt="img1"
//                         style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                     )}
//                     {room.image2 && (
//                       <img
//                         src={`http://localhost:5000/uploads/${room.image2}`}
//                         alt="img2"
//                         style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                     )}
//                     {room.image3 && (
//                       <img
//                         src={`http://localhost:5000/uploads/${room.image3}`}
//                         alt="img3"
//                         style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                         }}
//                       />

//                     )}
//                   </div>
//                 </td>
                

//                 <td style={{ padding: '50px' }}>{room.description}</td>
//                 {/*  Show facilities */}
//                 {/* Facilities */}
//                 <td>
//                   {room.facilities && room.facilities.length > 0 ? (
//                     <ul style={{ paddingLeft: "18px" }}>
//                       {getFacilityNames(room.facilities).map((facility, index) => (
//                         <li key={index}>{facility}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <span>No facilities</span>
//                   )}
//                 </td>
//                 <td>
//                   <div style={{ display: 'flex', gap: '5px' }}>
//                     <button
//                       onClick={() => navigate(`/admin/rooms/edit/${room._id}`)}
//                       style={{
//                         backgroundColor: '#28a745',
//                         color: 'white',
//                         padding: '15px 14px',
//                         border: 'none',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                         fontSize: '14px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '1px',
//                         marginRight: '8px'
//                       }}
//                     >
//                       <FaEdit /> Edit
//                     </button>

//                     <button
//                       onClick={() => deleteRoom(room._id)}
//                       style={{
//                         backgroundColor: '#dc3545',
//                         color: 'white',
//                         padding: '15px 14px',
//                         border: 'none',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                         fontSize: '14px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '1px'
//                       }}
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RoomManagement;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit, FaTrash } from "react-icons/fa";
// import AdminSidebar from "../components/AdminSidebar";

// const RoomManagement = () => {
//   const [rooms, setRooms] = useState([]);
//   const [facilities, setFacilities] = useState([]);
//   const [loading, setLoading] = useState(true); // Add loading state
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch both rooms and facilities, then set loading to false
//     const fetchData = async () => {
//       try {
//         const [roomsRes, facilitiesRes] = await Promise.all([
//           axios.get('http://localhost:5000/api/rooms'),
//           axios.get('http://localhost:5000/api/facilities')
//         ]);
//         setRooms(roomsRes.data);
//         setFacilities(facilitiesRes.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const deleteRoom = async (id) => {
//     if (window.confirm('Are you sure you want to delete this room?')) {
//       try {
//         await axios.delete(`http://localhost:5000/api/rooms/${id}`);
//         // Refresh rooms after delete
//         const res = await axios.get('http://localhost:5000/api/rooms');
//         setRooms(res.data);
//       } catch (err) {
//         console.error('Delete failed');
//         alert('Failed to delete room');
//       }
//     }
//   };

//   // helper: get facility names from IDs
//   const getFacilityNames = (facilityIds = []) => {
//     return facilities
//       .filter(f => facilityIds.includes(f._id))
//       .map(f => f.name);
//   };

//   if (loading) {
//     return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
//   }

//   return (
//     <div style={{ display: 'flex' }}>
//       <AdminSidebar />
//       <div style={{ marginLeft: '280px', padding: '20px', width: '100%', marginTop: '60px' }}>
//         <h2>Room Management</h2>
//         <button onClick={() => navigate('/admin/rooms/add')}>Add New Room</button>

//         <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Type</th>
//               <th>Price</th>
//               <th>Images</th>
//               <th>Description</th>
//               <th>Facilities</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rooms.map(room => (
//               <tr key={room._id} style={{ borderBottom: '1px solid #eee' }}>
//                 <td>{room.title}</td>
//                 <td>{room.type}</td>
//                 <td>₹{room.price}</td>
//                 <td>
//                   <div style={{ display: 'flex', gap: '5px', border: '1px solid #080000ff', padding: '10px' }}>
//                     {room.image1 && (
//                       <img src={`http://localhost:5000/uploads/${room.image1}`} alt="img1"
//                         style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
//                         onError={(e) => e.target.style.display = 'none'} />
//                     )}
//                     {room.image2 && (
//                       <img src={`http://localhost:5000/uploads/${room.image2}`} alt="img2"
//                         style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
//                         onError={(e) => e.target.style.display = 'none'} />
//                     )}
//                     {room.image3 && (
//                       <img src={`http://localhost:5000/uploads/${room.image3}`} alt="img3"
//                         style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
//                         onError={(e) => e.target.style.display = 'none'} />
//                     )}
//                   </div>
//                 </td>
//                 <td style={{ padding: '20px' }}>{room.description}</td>
//                 <td>
//                   {room.facilities && room.facilities.length > 0 ? (
//                     <ul style={{ paddingLeft: "18px" }}>
//                       {getFacilityNames(room.facilities).map((facility, index) => (
//                         <li key={index}>{facility}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <span>No facilities</span>
//                   )}
//                 </td>
//                 <td>
//                   <div style={{ display: 'flex', gap: '5px' }}>
//                     <button
//                       onClick={() => navigate(`/admin/rooms/edit/${room._id}`)}
//                       style={{
//                         backgroundColor: '#28a745',
//                         color: 'white',
//                         padding: '10px',
//                         border: 'none',
//                         borderRadius: '6px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => deleteRoom(room._id)}
//                       style={{
//                         backgroundColor: '#dc3545',
//                         color: 'white',
//                         padding: '10px',
//                         border: 'none',
//                         borderRadius: '6px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RoomManagement;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import "./RoomManagement.css";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, facilitiesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/rooms'),
          axios.get('http://localhost:5000/api/facilities')
        ]);
        setRooms(roomsRes.data);
        setFacilities(facilitiesRes.data);
        
        // Debug: Log the data to see the structure
        console.log('Rooms data:', roomsRes.data);
        console.log('Facilities data:', facilitiesRes.data);
        console.log('First room facilities:', roomsRes.data[0]?.facilities);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${id}`);
        // Refresh rooms after delete
        const res = await axios.get('http://localhost:5000/api/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error('Delete failed');
        alert('Failed to delete room');
      }
    }
  };

  // Enhanced helper function to get facility names from IDs
  const getFacilityNames = (facilityIds = []) => {
    if (!Array.isArray(facilityIds) || facilityIds.length === 0) {
      return [];
    }

    // If facilities are already populated (objects with name property)
    if (facilityIds.length > 0 && typeof facilityIds[0] === 'object' && facilityIds[0].name) {
      return facilityIds.map(f => f.name);
    }

    // If facilities are just IDs, find matching facility names
    return facilities
      .filter(f => facilityIds.includes(f._id))
      .map(f => f.name);
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="room-management">
        <div className="rm-header">
          <h2 className="rm-title">Room Management</h2>
          <button onClick={() => navigate('/admin/rooms/add')} className="btn btn-primary">Add New Room</button>
        </div>

        <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Images</th>
              <th>Description</th>
              <th>Facilities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                <td>{room.title}</td>
                <td>{room.type}</td>
                <td>₹{room.price}</td>
                <td>
                  <div className="image-thumbs">
                    {room.image1 && (
                      <img className="image-thumb" src={`http://localhost:5000/uploads/${room.image1}`} alt="img1" onError={(e) => e.target.style.display = 'none'} />
                    )}
                    {room.image2 && (
                      <img className="image-thumb" src={`http://localhost:5000/uploads/${room.image2}`} alt="img2" onError={(e) => e.target.style.display = 'none'} />
                    )}
                    {room.image3 && (
                      <img className="image-thumb" src={`http://localhost:5000/uploads/${room.image3}`} alt="img3" onError={(e) => e.target.style.display = 'none'} />
                    )}
                  </div>
                </td>
                <td>{room.description}</td>
                <td>
                  {(() => {
                    const facilityNames = getFacilityNames(room.facilities);
                    return facilityNames.length > 0 ? (
                      <ul style={{ paddingLeft: "18px", margin: 0 }}>
                        {facilityNames.map((facilityName, index) => (
                          <li key={index}>{facilityName}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="no-facilities">No facilities</span>
                    );
                  })()}
                </td>
                <td>
                  <div className="actions">
                    <button onClick={() => navigate(`/admin/rooms/edit/${room._id}`)} className="btn-edit">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => deleteRoom(room._id)} className="btn-delete">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
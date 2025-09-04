// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import './Home.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// // import facility from '../../../backend/models/facility';
// const Home = () => {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [checkIn, setCheckIn] = useState(null);
//   const [checkOut, setCheckOut] = useState(null);
//   const [searchPerformed, setSearchPerformed] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//   fetchInitialData();

//     // Check for navigation messages
//     if (location.state?.message) {
//       alert(location.state.message);
//       // Clear the message from state
//       navigate(location.pathname, { replace: true });
//     }
//   }, [location.state]);

//   const fetchInitialData = async () => {
//      try {
//       setLoading(true);
//       const [roomsRes, facilitiesRes] = await Promise.all([
//         axios.get('http://localhost:5000/api/rooms'),
//         axios.get('http://localhost:5000/api/facilities')
//       ]);
//       setRooms(roomsRes.data);
//       setFacilities(facilitiesRes.data);
      
//       // Debug logs
//       console.log('Rooms data:', roomsRes.data);
//       console.log('Facilities data:', facilitiesRes.data);
//       if (roomsRes.data[0]) {
//         console.log('First room facilities:', roomsRes.data[0].facilities);
//       }
      
//       setError(null);
//     } catch (err) {
//       console.error('Failed to fetch data:', err);
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRooms = async () => {
//     try {
//       setLoading(true);
//       let url = 'http://localhost:5000/api/rooms';
//       if (checkIn && checkOut) {
//         url += `?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`;
//         setSearchPerformed(true);
//       }
//       const response = await axios.get(url);
//       setRooms(response.data);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to fetch rooms:', err);
//       setError('Failed to fetch rooms');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateChange = () => {
//     if (checkIn && checkOut) {
//       fetchRooms();
//     }
//   };

//   const getFacilityNames = (facilityIds = []) => {
//     if (!Array.isArray(facilityIds) || facilityIds.length === 0) {
//       return [];
//     }

//     // If facilities are already populated (objects with name property)
//     if (facilityIds.length > 0 && typeof facilityIds[0] === 'object' && facilityIds[0] && facilityIds[0].name) {
//       return facilityIds.map(f => f.name);
//     }

//     // If facilities are just IDs, find matching facility names
//     return facilities
//       .filter(f => facilityIds.includes(f._id))
//       .map(f => f.name);
//   };

//   // FIXED: pass event and stop propagation so the card click doesn't fire
//   const handleBookNow = (e, roomId) => {
//     e.stopPropagation();
//     if (!checkIn || !checkOut) {
//       alert('Please select check-in and check-out dates first.');
//       return;
//     }
//     navigate(`/book-room/${roomId}`, {
//       state: { checkIn, checkOut }
//     });
//   };

//   if (loading) {
//     return <div style={{ padding: '20px', textAlign: 'center' }}>Loading rooms...</div>;
//   }

//   if (error) {
//     return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;
//   }

//   return (
//     <div style={{ marginTop: '60px' }}>
//       {/* Hero Section with Date Pickers */}
//       <div className="hero-section">
//         <h1>Welcome to Vivan Hotel</h1>
//         <p>Find your perfect stay with us</p>

//         <div className="date-picker-container">
//           <div className="date-picker">
//             <label>Check-in Date:</label>
//             <DatePicker
//               selected={checkIn}
//               onChange={(date) => setCheckIn(date)}
//               selectsStart
//               startDate={checkIn}
//               endDate={checkOut}
//               minDate={new Date()}
//               placeholderText="Select check-in date"
//             />
//           </div>

//           <div className="date-picker">
//             <label>Check-out Date:</label>
//             <DatePicker
//               selected={checkOut}
//               onChange={(date) => setCheckOut(date)}
//               selectsEnd
//               startDate={checkIn}
//               endDate={checkOut}
//               minDate={checkIn}
//               placeholderText="Select check-out date"
//             />
//           </div>

//           <button onClick={handleSearch} className="search-btn" style={{ backgroundColor: '#4d3c3cff', color: 'white' }}>
//             Search Rooms
//           </button>
//         </div>
//       </div>

//       {/* Search Results Info */}
//       {searchPerformed && (
//         <div className="search-results-info">
//           <h3>
//             Search Results for {checkIn?.toLocaleDateString()} - {checkOut?.toLocaleDateString()}
//           </h3>
//           <p>
//             Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''} 
//             ({rooms.filter(room => room.isAvailableForDates).length} available)
//           </p>
//         </div>
//       )}

//       {/* Room List */}
//       {/*  */}
//       <div className="room-list">
//         {rooms.map((room) => {
//           const facilityNames = getFacilityNames(room.facilities);
          
//           return (
//             <div
//               className="room-card"
//               key={room._id}
//               onClick={() => navigate(`/rooms/${room._id}`, { 
//                 state: { checkIn, checkOut } 
//               })}
//               style={{ cursor: 'pointer' }}
//             >
//               <img
//                 src={`http://localhost:5000/uploads/${room.image1}`}
//                 alt={room.title}
//                 className="room-image"
//                 onError={(e) => {
//                   e.target.src = 'https://placehold.co/300x200?text=No+Image';
//                 }}
//               />
              
//               {/* Availability Status Tag */}
//               {searchPerformed && (
//                 <div className={`availability-tag ${room.isAvailableForDates ? 'available' : 'not-available'}`}>
//                   {room.isAvailableForDates ? 'Available' : 'Not Available'}
//                 </div>
//               )}
              
//               <div className="room-info">
//                 <h3>{room.title}</h3>
//                 <p><strong>Type:</strong> {room.type}</p>
                
//                 {/* Price Display */}
//                 {room.discountPercent && room.discountPercent > 0 ? (
//                   <p>
//                     <strong>Price:</strong>
//                     <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '6px' }}>
//                       ₹{room.price}
//                     </span>
//                     <span style={{ marginLeft: '8px', color: '#d32f2f', fontWeight: 'bold' }}>
//                       ₹{Math.round(room.price * (1 - room.discountPercent / 100))}
//                     </span>
//                     <span style={{ marginLeft: '6px', color: '#2e7d32' }}>
//                       ({room.discountPercent}% OFF)
//                     </span>
//                     <span> / night</span>
//                   </p>
//                 ) : (
//                   <p><strong>Price:</strong> ₹{room.price} / night</p>
//                 )}

//                 {/* Facilities Display - FIXED */}
//                 <p>
//                   <strong>Facilities:</strong>{" "}
//                   {facilityNames.length > 0 ? (
//                     <span style={{ color: '#666' }}>
//                       {facilityNames.join(', ')}
//                     </span>
//                   ) : (
//                     <span style={{ color: '#999', fontStyle: 'italic' }}>No facilities</span>
//                   )}
//                 </p>

//                 {/* Description */}
//                 <p style={{ color: '#666', fontSize: '14px' }}>
//                   {room.description.length > 100 
//                     ? `${room.description.substring(0, 100)}...` 
//                     : room.description
//                   }
//                 </p>

//                 {/* Book Now Button */}
//                 <button
//                   onClick={(e) => handleBookNow(e, room._id)}
//                   disabled={searchPerformed && !room.isAvailableForDates}
//                   style={{
//                     backgroundColor: searchPerformed && !room.isAvailableForDates ? '#6c757d' : 'teal',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '6px',
//                     padding: '8px 16px',
//                     cursor: searchPerformed && !room.isAvailableForDates ? 'not-allowed' : 'pointer',
//                     opacity: searchPerformed && !room.isAvailableForDates ? 0.6 : 1,
//                     width: '100%',
//                     marginTop: '10px'
//                   }}
//                 >
//                   {searchPerformed && !room.isAvailableForDates ? 'Not Available' : 'Book Now'}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

     
//       {/* No Results Message */}
//       {searchPerformed && rooms.length === 0 && (
//         <div className="no-results">
//           <h3>No rooms found for the selected dates</h3>
//           <p>Try selecting different dates or contact us for assistance.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Home.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [facilities, setFacilities] = useState([]); // Add facilities state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchInitialData();
    
    // Check for navigation messages
    if (location.state?.message) {
      alert(location.state.message);
      // Clear the message from state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Fetch both rooms and facilities
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [roomsRes, facilitiesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/rooms'),
        axios.get('http://localhost:5000/api/facilities')
      ]);
      setRooms(roomsRes.data);
      setFacilities(facilitiesRes.data);
      
      // Debug logs
      console.log('Rooms data:', roomsRes.data);
      console.log('Facilities data:', facilitiesRes.data);
      if (roomsRes.data[0]) {
        console.log('First room facilities:', roomsRes.data[0].facilities);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/rooms';
      if (checkIn && checkOut) {
        url += `?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`;
        setSearchPerformed(true);
      }
      const response = await axios.get(url);
      setRooms(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = () => {
    if (checkIn && checkOut) {
      fetchRooms();
    }
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert('Please select both check-in and check-out dates.');
      return;
    }
    if (checkIn >= checkOut) {
      alert('Check-out date must be after check-in date.');
      return;
    }
    fetchRooms();
  };

  // Helper function to get facility names from IDs
  const getFacilityNames = (facilityIds = []) => {
    if (!Array.isArray(facilityIds) || facilityIds.length === 0) {
      return [];
    }

    // If facilities are already populated (objects with name property)
    if (facilityIds.length > 0 && typeof facilityIds[0] === 'object' && facilityIds[0] && facilityIds[0].name) {
      return facilityIds.map(f => f.name);
    }

    // If facilities are just IDs, find matching facility names
    return facilities
      .filter(f => facilityIds.includes(f._id))
      .map(f => f.name);
  };

  // FIXED: pass event and stop propagation so the card click doesn't fire
  const handleBookNow = (e, roomId) => {
    e.stopPropagation();
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates first.');
      return;
    }
    navigate(`/book-room/${roomId}`, {
      state: { checkIn, checkOut }
    });
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--danger-red)' }}>{error}</div>;
  }

  return (
    <div style={{ marginTop: '70px' }}>
      {/* Hero Section with Date Pickers */}
      <div className="hero-section">
        <h1>Welcome to Vivan Hotel</h1>
        <p>Find your perfect stay with us</p>

        <div className="date-picker-container">
          <div className="date-picker">
            <label>Check-in Date</label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              placeholderText="Select check-in date"
              className="form-input"
            />
          </div>

          <div className="date-picker">
            <label>Check-out Date</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn}
              placeholderText="Select check-out date"
              className="form-input"
            />
          </div>

          <button onClick={handleSearch} className="search-btn">
            Search Rooms
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchPerformed && (
        <div className="search-results-info">
          <h3>
            Search Results for {checkIn?.toLocaleDateString()} - {checkOut?.toLocaleDateString()}
          </h3>
          <p>
            Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''} 
            {searchPerformed && (
              <span> ({rooms.filter(room => room.isAvailableForDates).length} available)</span>
            )}
          </p>
        </div>
      )}

      {/* Room List */}
      <div className="room-list">
        {rooms.map((room) => {
          const facilityNames = getFacilityNames(room.facilities);
          
          return (
            <div
              className="room-card"
              key={room._id}
              onClick={() => navigate(`/rooms/${room._id}`, { 
                state: { checkIn, checkOut } 
              })}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={`http://localhost:5000/uploads/${room.image1}`}
                alt={room.title}
                className="room-image"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/300x200?text=No+Image';
                }}
              />
              
              {/* Availability Status Tag */}
              {searchPerformed && (
                <div className={`availability-tag ${room.isAvailableForDates ? 'available' : 'not-available'}`}>
                  {room.isAvailableForDates ? 'Available' : 'Not Available'}
                </div>
              )}
              
              <div className="room-info">
                <h3>{room.title}</h3>
                <p><strong>Type:</strong> {room.type}</p>
                
                {/* Price Display */}
                {room.discountPercent && room.discountPercent > 0 ? (
                  <p>
                    <strong>Price:</strong>
                    <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '6px' }}>
                      ₹{room.price}
                    </span>
                    <span style={{ marginLeft: '8px', color: '#d32f2f', fontWeight: 'bold' }}>
                      ₹{Math.round(room.price * (1 - room.discountPercent / 100))}
                    </span>
                    <span style={{ marginLeft: '6px', color: '#2e7d32' }}>
                      ({room.discountPercent}% OFF)
                    </span>
                    <span> / night</span>
                  </p>
                ) : (
                  <p><strong>Price:</strong> ₹{room.price} / night</p>
                )}

                {/* Facilities Display - FIXED */}
                <p>
                  <strong>Facilities:</strong>{" "}
                  {facilityNames.length > 0 ? (
                    <span style={{ color: '#666' }}>
                      {facilityNames.join(', ')}
                    </span>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>No facilities</span>
                  )}
                </p>

                {/* Description */}
                {/* <p style={{ color: '#666', fontSize: '14px' }}>
                  {room.description.length > 100 
                    ? `${room.description.substring(0, 100)}...` 
                    : room.description
                  }
                </p> */}

                {/* Book Now Button */}
                <button
                  onClick={(e) => handleBookNow(e, room._id)}
                  disabled={searchPerformed && !room.isAvailableForDates}
                  style={{
                    width: '100%',
                    marginTop: 'var(--spacing-md)',
                    backgroundColor: searchPerformed && !room.isAvailableForDates ? 'var(--text-muted)' : '',
                    cursor: searchPerformed && !room.isAvailableForDates ? 'not-allowed' : 'pointer',
                    opacity: searchPerformed && !room.isAvailableForDates ? 0.6 : 1,
                  }}
                >
                  {searchPerformed && !room.isAvailableForDates ? 'Not Available' : 'Book Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {searchPerformed && rooms.length === 0 && (
        <div className="no-results">
          <h3>No rooms found for the selected dates</h3>
          <p>Try selecting different dates or contact us for assistance.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
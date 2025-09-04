// // src/pages/RoomDetails.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

// const RoomDetails = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const [room, setRoom] = useState(null);
//   const [facilities, setFacilities] = useState([]); // Add facilities state
//   const [loading, setLoading] = useState(true);
//   const [availabilityStatus, setAvailabilityStatus] = useState(null);
//   const navigate = useNavigate();

//   // Get dates from location state if available
//   const { checkIn, checkOut } = location.state || {};

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch both room details and facilities
//         const [roomRes, facilitiesRes] = await Promise.all([
//           axios.get(`http://localhost:5000/api/rooms/${id}${checkIn && checkOut ? `?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}` : ''}`),
//           axios.get('http://localhost:5000/api/facilities')
//         ]);
        
//         setRoom(roomRes.data);
//         setFacilities(facilitiesRes.data);
        
//         // Debug logs
//         console.log('Room data:', roomRes.data);
//         console.log('Facilities data:', facilitiesRes.data);
//         console.log('Room facilities:', roomRes.data.facilities);
        
//         // If dates are provided, check availability
//         if (checkIn && checkOut && roomRes.data.isAvailableForDates !== undefined) {
//           setAvailabilityStatus(roomRes.data.isAvailableForDates);
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, checkIn, checkOut]);

//   // Helper function to get facility names from IDs
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

//   const handleBookNow = () => {
//     if (checkIn && checkOut) {
//       // If dates are already selected, proceed to booking
//       navigate(`/book-room/${id}`, {
//         state: { checkIn, checkOut }
//       });
//     } else {
//       // If no dates selected, go to home page to select dates
//       navigate('/', { 
//         state: { 
//           message: 'Please select check-in and check-out dates to book this room.' 
//         } 
//       });
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!room) return <p>Room not found</p>;

//   const facilityNames = getFacilityNames(room.facilities);

//   return (
//     <div style={{ padding: "20px", marginTop: '60px' }}>
      
//       <h2>{room.title}</h2>
      
//       {/* Availability Status */}
//       {availabilityStatus !== null && (
//         <div style={{
//           padding: '10px 15px',
//           borderRadius: '6px',
//           marginBottom: '20px',
//           backgroundColor: availabilityStatus ? '#d4edda' : '#f8d7da',
//           color: availabilityStatus ? '#155724' : '#721c24',
//           border: `1px solid ${availabilityStatus ? '#c3e6cb' : '#f5c6cb'}`,
//           display: 'flex',
//           alignItems: 'center',
//           gap: '10px'
//         }}>
//           <span style={{
//             width: '12px',
//             height: '12px',
//             borderRadius: '50%',
//             backgroundColor: availabilityStatus ? '#28a745' : '#dc3545'
//           }}></span>
//           <strong>
//             {availabilityStatus ? 'Available' : 'Not Available'} 
//             {checkIn && checkOut && ` for ${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}`}
//           </strong>
//         </div>
//       )}
      
//       {/* Room Images */}
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
//         {room.image1 && (
//           <img 
//             src={`http://localhost:5000/uploads/${room.image1}`} 
//             alt="Room view 1" 
//             style={{ 
//               width: '300px', 
//               height: '200px', 
//               objectFit: 'cover', 
//               borderRadius: '8px',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//             }}
//             onError={(e) => {
//               e.target.src = 'https://placehold.co/300x200?text=No+Image';
//             }}
//           />
//         )}
//         {room.image2 && (
//           <img 
//             src={`http://localhost:5000/uploads/${room.image2}`} 
//             alt="Room view 2" 
//             style={{ 
//               width: '300px', 
//               height: '200px', 
//               objectFit: 'cover', 
//               borderRadius: '8px',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//             }}
//             onError={(e) => {
//               e.target.src = 'https://placehold.co/300x200?text=No+Image';
//             }}
//           />
//         )}
//         {room.image3 && (
//           <img 
//             src={`http://localhost:5000/uploads/${room.image3}`} 
//             alt="Room view 3" 
//             style={{ 
//               width: '300px', 
//               height: '200px', 
//               objectFit: 'cover', 
//               borderRadius: '8px',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//             }}
//             onError={(e) => {
//               e.target.src = 'https://placehold.co/300x200?text=No+Image';
//             }}
//           />
//         )}
//       </div>

//       {/* Room Information */}
//       <div style={{ 
//         backgroundColor: '#f8f9fa', 
//         padding: '20px', 
//         borderRadius: '8px', 
//         marginBottom: '20px' 
//       }}>
//         <p><strong>Type:</strong> {room.type}</p>
        
//         {/* Price Display with Discount */}
//         {room.discountPercent && room.discountPercent > 0 ? (
//           <p>
//             <strong>Price:</strong>
//             <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '6px' }}>
//               ₹{room.price}
//             </span>
//             <span style={{ marginLeft: '8px', color: '#d32f2f', fontWeight: 'bold', fontSize: '18px' }}>
//               ₹{Math.round(room.price * (1 - room.discountPercent / 100))}
//             </span>
//             <span style={{ marginLeft: '6px', color: '#2e7d32', fontWeight: 'bold' }}>
//               ({room.discountPercent}% OFF)
//             </span>
//             <span> / night</span>
//           </p>
//         ) : (
//           <p><strong>Price:</strong> ₹{room.price} / night</p>
//         )}

//         {/* Facilities Display */}
//         <div style={{ marginTop: '15px' }}>
//           <strong>Facilities:</strong>
//           {facilityNames.length > 0 ? (
//             <div style={{ marginTop: '8px' }}>
//               <ul style={{ 
//                 display: 'grid', 
//                 gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//                 gap: '5px',
//                 paddingLeft: '20px',
//                 margin: 0
//               }}>
//                 {facilityNames.map((facilityName, index) => (
//                   <li key={index} style={{ 
//                     color: '#333',
//                     padding: '2px 0'
//                   }}>
//                     ✓ {facilityName}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <span style={{ 
//               color: '#999', 
//               fontStyle: 'italic', 
//               marginLeft: '8px' 
//             }}>
//               No facilities available
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Room Description */}
//       <div style={{ marginBottom: '20px' }}>
//         <h3>About This Room</h3>
//         <p style={{ 
//           lineHeight: '1.6', 
//           color: '#555',
//           backgroundColor: 'white',
//           padding: '15px',
//           borderRadius: '8px',
//           border: '1px solid #e9ecef'
//         }}>
//           {room.description}
//         </p>
//       </div>

//       {/* Action Buttons */}
//       <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//         <button 
//           onClick={handleBookNow}
//           disabled={availabilityStatus === false}
//           style={{
//             backgroundColor: availabilityStatus === false ? '#6c757d' : '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             padding: '12px 24px',
//             fontSize: '16px',
//             cursor: availabilityStatus === false ? 'not-allowed' : 'pointer',
//             opacity: availabilityStatus === false ? 0.6 : 1,
//             fontWeight: 'bold'
//           }}
//         >
//           {availabilityStatus === false ? 'Not Available' : 'Book Now'}
//         </button>
        
//         <button 
//           onClick={() => navigate(-1)} 
//           style={{
//             backgroundColor: '#6c757d',
//             color: 'white',
//             padding: '12px 24px',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             fontSize: '16px'
//           }}
//         >
//           ← Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RoomDetails;



// src/pages/RoomDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const RoomDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For image slider
  const navigate = useNavigate();

  // Get dates from location state if available
  const { checkIn, checkOut } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomRes, facilitiesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/rooms/${id}${checkIn && checkOut ? `?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}` : ''}`),
          axios.get('http://localhost:5000/api/facilities')
        ]);
        
        setRoom(roomRes.data);
        setFacilities(facilitiesRes.data);
        
        console.log('Room data:', roomRes.data);
        console.log('Facilities data:', facilitiesRes.data);
        console.log('Room facilities:', roomRes.data.facilities);
        
        if (checkIn && checkOut && roomRes.data.isAvailableForDates !== undefined) {
          setAvailabilityStatus(roomRes.data.isAvailableForDates);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, checkIn, checkOut]);

  // Helper function to get facility names from IDs
  const getFacilityNames = (facilityIds = []) => {
    if (!Array.isArray(facilityIds) || facilityIds.length === 0) {
      return [];
    }

    if (facilityIds.length > 0 && typeof facilityIds[0] === 'object' && facilityIds[0] && facilityIds[0].name) {
      return facilityIds.map(f => f.name);
    }

    return facilities
      .filter(f => facilityIds.includes(f._id))
      .map(f => f.name);
  };

  const handleBookNow = () => {
    if (checkIn && checkOut) {
      navigate(`/book-room/${id}`, {
        state: { checkIn, checkOut }
      });
    } else {
      navigate('/', { 
        state: { 
          message: 'Please select check-in and check-out dates to book this room.' 
        } 
      });
    }
  };

  // Get available images
  const getAvailableImages = () => {
    const images = [];
    if (room.image1) images.push(room.image1);
    if (room.image2) images.push(room.image2);
    if (room.image3) images.push(room.image3);
    return images;
  };

  const nextImage = () => {
    const images = getAvailableImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getAvailableImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      fontSize: '18px'
    }}>
      Loading...
    </div>
  );
  
  if (!room) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      fontSize: '18px',
      color: '#dc3545'
    }}>
      Room not found
    </div>
  );

  const facilityNames = getFacilityNames(room.facilities);
  const availableImages = getAvailableImages();

  return (
    <div style={{ 
      padding: "20px", 
      marginTop: '60px',
      maxWidth: '1200px',
      margin: '60px auto 0',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Main Room Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        
        {/* Image Slider Section */}
        <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
          {availableImages.length > 0 ? (
            <>
              <img 
                src={`http://localhost:5000/uploads/${availableImages[currentImageIndex]}`}
                alt={`${room.title} - Image ${currentImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/800x400?text=No+Image';
                }}
              />
              
              {/* Navigation Arrows */}
              {availableImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '45px',
                      height: '45px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      zIndex: 2
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.8)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.6)'}
                  >
                    ❮
                  </button>
                  
                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '45px',
                      height: '45px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      zIndex: 2
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.8)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.6)'}
                  >
                    ❯
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              {availableImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 2
                }}>
                  {availableImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* Image Counter */}
              {availableImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  zIndex: 2
                }}>
                  {currentImageIndex + 1} / {availableImages.length}
                </div>
              )}
            </>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              fontSize: '18px'
            }}>
              No Images Available
            </div>
          )}
        </div>

        {/* Room Content */}
        <div style={{ padding: '30px' }}>
          
          {/* Room Title */}
          <h1 style={{ 
            margin: '0 0 10px 0',
            color: '#2c3e50',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            {room.title}
          </h1>

          {/* Availability Status */}
          {availabilityStatus !== null && (
            <div style={{
              padding: '12px 20px',
              borderRadius: '10px',
              marginBottom: '25px',
              backgroundColor: availabilityStatus ? '#d4edda' : '#f8d7da',
              color: availabilityStatus ? '#155724' : '#721c24',
              border: `2px solid ${availabilityStatus ? '#c3e6cb' : '#f5c6cb'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: 'bold'
            }}>
              <span style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: availabilityStatus ? '#28a745' : '#dc3545'
              }}></span>
              {availabilityStatus ? '✅ Available' : '❌ Not Available'} 
              {checkIn && checkOut && ` for ${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}`}
            </div>
          )}

          {/* Room Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px',
            marginBottom: '25px'
          }}>
            
            {/* Basic Info Card */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#495057', fontSize: '18px' }}>Room Details</h3>
              
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#343a40' }}>Type: </span>
                <span style={{ 
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {room.type}
                </span>
              </div>

              {/* Price Display */}
              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#343a40' }}>Price: </span>
                {room.discountPercent && room.discountPercent > 0 ? (
                  <div style={{ marginTop: '5px' }}>
                    <span style={{ 
                      textDecoration: 'line-through', 
                      color: '#6c757d', 
                      fontSize: '16px'
                    }}>
                      ₹{room.price}
                    </span>
                    <span style={{ 
                      marginLeft: '10px', 
                      color: '#dc3545', 
                      fontWeight: 'bold', 
                      fontSize: '22px'
                    }}>
                      ₹{Math.round(room.price * (1 - room.discountPercent / 100))}
                    </span>
                    <span style={{ color: '#6c757d' }}> / night</span>
                    <div style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginLeft: '10px'
                    }}>
                      {room.discountPercent}% OFF
                    </div>
                  </div>
                ) : (
                  <span style={{ 
                    color: '#28a745', 
                    fontWeight: 'bold', 
                    fontSize: '22px'
                  }}>
                    ₹{room.price} <span style={{ fontSize: '16px', color: '#6c757d' }}>/ night</span>
                  </span>
                )}
              </div>
            </div>

            {/* Facilities Card */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#495057', fontSize: '18px' }}>
                🏨 Room Facilities
              </h3>
              
              {facilityNames.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '8px'
                }}>
                  {facilityNames.map((facilityName, index) => (
                    <div key={index} style={{
                      backgroundColor: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓</span>
                      {facilityName}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#6c757d',
                  fontStyle: 'italic',
                  padding: '20px'
                }}>
                  No facilities available
                </div>
              )}
            </div>
          </div>

          {/* Description Card */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '25px',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            marginBottom: '25px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#495057', fontSize: '18px' }}>
              📝 About This Room
            </h3>
            <p style={{ 
              lineHeight: '1.7', 
              color: '#495057',
              margin: 0,
              fontSize: '16px'
            }}>
              {room.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            marginTop: '30px'
          }}>
            <button 
              onClick={handleBookNow}
              disabled={availabilityStatus === false}
              style={{
                backgroundColor: availabilityStatus === false ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: availabilityStatus === false ? 'not-allowed' : 'pointer',
                opacity: availabilityStatus === false ? 0.6 : 1,
                transition: 'all 0.3s ease',
                minWidth: '150px'
              }}
              onMouseOver={(e) => {
                if (availabilityStatus !== false) {
                  e.target.style.backgroundColor = '#218838';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (availabilityStatus !== false) {
                  e.target.style.backgroundColor = '#28a745';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {availabilityStatus === false ? '❌ Not Available' : '🛏️ Book Now'}
            </button>
            
            <button 
              onClick={() => navigate(-1)} 
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                minWidth: '150px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#5a6268';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#6c757d';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Summary Card */}
      <div style={{
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>✨ Perfect for Your Stay</h3>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
          {room.type} • ₹{room.discountPercent > 0 ? Math.round(room.price * (1 - room.discountPercent / 100)) : room.price} per night
          {facilityNames.length > 0 && ` • ${facilityNames.length} facilities included`}
        </p>
      </div>
    </div>
  );
};

export default RoomDetails;
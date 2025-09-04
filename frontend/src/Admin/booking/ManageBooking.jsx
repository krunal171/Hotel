
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import "./ManageBooking.css";

const ManageBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/bookings");
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/bookings/${id}`);
            setBookings(bookings.filter((b) => b._id !== id));
            alert("Booking deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete booking");
        }
    };

    // Generate PDF download for booking
    const downloadBookingPDF = (booking) => {
        const generatePDFContent = () => {
            const totalDays = Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24));
            const roomPrice = booking.roomId?.price || 0;
            const discountPercent = booking.roomId?.discountPercent || 0;
            const discountedPrice = discountPercent > 0 ? Math.round(roomPrice * (1 - discountPercent / 100)) : roomPrice;
            const totalAmount = discountedPrice * totalDays;

            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Booking Confirmation - ${booking.customerName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
                        .hotel-name { color: #007bff; font-size: 28px; font-weight: bold; margin: 0; }
                        .booking-title { color: #666; font-size: 18px; margin: 10px 0; }
                        .booking-id { background: #f8f9fa; padding: 10px; border-radius: 5px; font-weight: bold; }
                        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                        .section h3 { margin-top: 0; color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 8px; }
                        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                        .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #ccc; }
                        .label { font-weight: bold; color: #555; }
                        .value { color: #333; }
                        .total-amount { background: #28a745; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 20px; font-weight: bold; }
                        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                        .discount { color: #28a745; font-weight: bold; }
                        .original-price { text-decoration: line-through; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 class="hotel-name">Vivan Hotel</h1>
                        <p class="booking-title">Booking Confirmation</p>
                        <div class="booking-id">Booking ID: ${booking._id}</div>
                    </div>

                    <div class="section">
                        <h3>Customer Information</h3>
                        <div class="info-item">
                            <span class="label">Name:</span>
                            <span class="value">${booking.customerName}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Phone:</span>
                            <span class="value">${booking.phone}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Number of Persons:</span>
                            <span class="value">${booking.persons}</span>
                        </div>
                    </div>

                    <div class="section">
                        <h3>Room Details</h3>
                        <div class="info-item">
                            <span class="label">Room:</span>
                            <span class="value">${booking.roomId?.title || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Type:</span>
                            <span class="value">${booking.roomId?.type || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Original Price per night:</span>
                            <span class="value ${discountPercent > 0 ? 'original-price' : ''}">₹${roomPrice}</span>
                        </div>
                        ${discountPercent > 0 ? `
                        <div class="info-item">
                            <span class="label">Discounted Price per night:</span>
                            <span class="value discount">₹${discountedPrice} (${discountPercent}% OFF)</span>
                        </div>
                        ` : ''}
                    </div>

                    <div class="section">
                        <h3>Stay Details</h3>
                        <div class="info-item">
                            <span class="label">Check-In:</span>
                            <span class="value">${new Date(booking.checkInDate).toLocaleDateString()}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Check-Out:</span>
                            <span class="value">${new Date(booking.checkOutDate).toLocaleDateString()}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Total Days:</span>
                            <span class="value">${totalDays}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Booking Date:</span>
                            <span class="value">${new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div class="total-amount">
                        Total Amount: ₹${totalAmount}
                    </div>

                    <div class="footer">
                        <p>Thank you for choosing Vivan Hotel!</p>
                        <p>For any queries, please contact us.</p>
                        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                </body>
                </html>
            `;
        };

        // Create and download PDF
        const htmlContent = generatePDFContent();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `booking-${booking.customerName}-${booking._id}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex' }}>
                <AdminSidebar />
                <div style={{ marginLeft: '280px', padding: '20px', width: '100%', marginTop: '60px' }}>
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading bookings...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            <AdminSidebar />
            <div style={{ marginLeft: '280px', padding: '20px', width: '100%', marginTop: '60px' }}>
                <div style={{ padding: "20px" }}>
                    <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '30px',
                                padding: '20px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '10px',
                                border: '1px solid #dee2e6'
                    }}>
                        <h2 style={{ margin: 0, color: '#495057' }}>Manage Bookings</h2>
                        <div style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            fontWeight: 'bold'
                        }}>
                            Total Bookings: {bookings.length}
                        </div>
                    </div>

                    {bookings.length === 0 ? (
                        <div >
                            <h3>No bookings found</h3>
                            <p>Bookings will appear here once customers make reservations.</p>
                        </div>
                    ) : (
                        <div style={{
                           
                        }}>
                            <table style={{ 
                                width: '100%', 
                                border: '1px solid #9ca5a9ff',
                              
                            }}>
                                <thead>
                                    <tr style={{ 
                                      
                                    }}>
                                        <th style={{ padding: '15px 10px', textAlign: 'left' }}>Image</th>
                                        <th style={{ padding: '15px 10px', textAlign: 'left' }}>Customer</th>
                                        <th style={{ padding: '15px 10px', textAlign: 'left' }}>Room</th>
                                        <th style={{ padding: '15px 10px', textAlign: 'left' }}>Dates</th>
                                        <th style={{ padding: '15px 10px', textAlign: 'left' }}>Persons</th>
                                        <th style={{ padding: '15px 10px', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b, index) => (
                                        <tr key={b._id} style={{ 
                                            borderBottom: '1px solid #dee2e6',
                                            backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                                        }}>
                                            {/* Room Image */}
                                            <td style={{ padding: '12px 10px' }}>
                                                {b.roomId?.image1 ? (
                                                    <img 
                                                        src={`http://localhost:5000/uploads/${b.roomId.image1}`}
                                                        alt={b.roomId?.title || 'Room'}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            border: '2px solid #dee2e6'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src = 'https://placehold.co/60x60?text=No+Image';
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        backgroundColor: '#e9ecef',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px',
                                                        color: '#6c757d'
                                                    }}>
                                                        No Image
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Customer Info */}
                                            <td style={{ padding: '12px 10px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#495057' }}>
                                                        {b.customerName}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                        {b.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Room Info */}
                                            <td style={{ padding: '12px 10px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#495057' }}>
                                                        {b.roomId?.title || "N/A"}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                        {b.roomId?.type || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Dates */}
                                            <td style={{ padding: '12px 10px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#495057', fontSize: '13px' }}>Check-in:</div>
                                                    <div>
                                                        {new Date(b.checkInDate).toLocaleDateString()}
                                                    </div>
                                                    <div style={{ fontWeight: 'bold', color: '#495057', fontSize: '13px' }}>Check-out:</div>
                                                    <div>
                                                        {new Date(b.checkOutDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Persons */}
                                            <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                                <span>
                                                    {b.persons}
                                                </span>
                                            </td>
                                            
                                            {/* Actions */}
                                            <td style={{ padding: '12px 10px' }}>
                                                <div className="booking-actions">
                                                    <button onClick={() => setSelectedBooking(b)} className="btn-view">View</button>
                                                    <button onClick={() => downloadBookingPDF(b)} className="btn-pdf">PDF</button>
                                                    <button onClick={() => deleteBooking(b._id)} className="btn-delete">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Enhanced Booking Details Modal */}
                    {selectedBooking && (
                        <div
                            style={{
                                position: "fixed",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.6)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1000
                            }}
                            onClick={() => setSelectedBooking(null)}
                        >
                            <div
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "16px",
                                    width: "90%",
                                    maxWidth: "600px",
                                    maxHeight: "90vh",
                                    overflow: "auto",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header with Room Image */}
                                <div style={{
                                    position: 'relative',
                                    height: '200px',
                                    overflow: 'hidden',
                                    borderRadius: '16px 16px 0 0'
                                }}>
                                    {selectedBooking.roomId?.image1 ? (
                                        <img 
                                            src={`http://localhost:5000/uploads/${selectedBooking.roomId.image1}`}
                                            alt={selectedBooking.roomId?.title || 'Room'}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/600x200?text=Room+Image';
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#e9ecef',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#6c757d',
                                            fontSize: '16px'
                                        }}>
                                            No Room Image Available
                                        </div>
                                    )}
                                    
                                    {/* Close Button Overlay */}
                                    <button 
                                        onClick={() => setSelectedBooking(null)}
                                        style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '35px',
                                            height: '35px',
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div style={{ padding: '25px' }}>
                                    <h2>
                                        Booking Details
                                    </h2>

                                    {/* Customer Info Section */}
                                    <div>
                                        <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Customer Information</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <div>
                                                <strong>Name:</strong><br/>
                                                <span style={{ color: '#6c757d' }}>{selectedBooking.customerName}</span>
                                            </div>
                                            <div>
                                                <strong>Phone:</strong><br/>
                                                <span style={{ color: '#6c757d' }}>{selectedBooking.phone}</span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '15px' }}>
                                            <strong>Persons:</strong> 
                                            <span >
                                                {selectedBooking.persons}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Room & Stay Info */}
                                    <div>
                                        <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Room & Stay Details</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <div>
                                                <strong>Room:</strong><br/>
                                                <span style={{ color: '#6c757d' }}>{selectedBooking.roomId?.title || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <strong>Type:</strong><br/>
                                                <span style={{ color: '#6c757d' }}>{selectedBooking.roomId?.type || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <strong>Check-In:</strong><br/>
                                                <span style={{ color: '#6c757d' }}>
                                                    {new Date(selectedBooking.checkInDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div>
                                                <strong>Check-Out:</strong><br/>
                                                <span style={{ color: '#6c757d' }}>
                                                    {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Booking Date */}
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            <small style={{ color: '#6c757d' }}>
                                                Booked on: {new Date(selectedBooking.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>

                                    {/* ID Proof Section */}
                                    {selectedBooking.idProofUrl && (
                                        <div>
                                            <strong>ID Proof:</strong>
                                            <a 
                                                href={selectedBooking.idProofUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                
                                            >
                                                View Document
                                            </a>
                                        </div>
                                    )}

                                   
<button 
    onClick={() => downloadBookingPDF(selectedBooking)}
    style={{
        backgroundColor: "#007bff",  // blue
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
    }}
>
    Download PDF
</button>

<button 
    onClick={() => setSelectedBooking(null)}
    style={{
        backgroundColor: "#6d8193",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        margin: "0 40px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
    }}
>
    Close
</button>

                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBooking;
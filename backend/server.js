// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomroutes'); 
const facilities= require('./routes/facilityRoutes');
// const adminRoutes = require("./routes/adminRoutes");




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use('/api/rooms', roomRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

app.use('/api/facilities', facilities);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

app.use('/uploads', express.static('uploads')); // for serving ID/ PDF files

// Contact routes
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


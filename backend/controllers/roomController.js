const Room = require('../models/room');
const Booking = require('../models/booking'); // Added Booking model import
const facility = require('../models/facility');

// GET all rooms with availability check
exports.getAllRooms = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    // Get all rooms
    const rooms = await Room.find();
    
    // If dates are provided, check availability for each room
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Check availability for each room
      const roomsWithAvailability = await Promise.all(
        rooms.map(async (room) => {
          // Check if there are any existing bookings that overlap with the requested dates
          const existingBooking = await Booking.findOne({
            roomId: room._id,
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate },
            bookingStatus: 'confirmed'
          });
          
          // Room is available if no overlapping bookings exist
          const isAvailable = !existingBooking;
          
          return {
            ...room.toObject(),
            isAvailableForDates: isAvailable
          };
        })
      );
      
      res.json(roomsWithAvailability);
    } else {
      // If no dates provided, return rooms with default availability
      const roomsWithDefaultAvailability = rooms.map(room => ({
        ...room.toObject(),
        isAvailableForDates: true // Default to available when no dates specified
      }));
      
      res.json(roomsWithDefaultAvailability);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: err.message });
  }
};



// GET single room by ID with availability check
exports.getRoomById = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // If dates are provided, check availability
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Check if there are any existing bookings that overlap with the requested dates
      const existingBooking = await Booking.findOne({
        roomId: room._id,
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate },
        bookingStatus: 'confirmed'
      });
      
      // Room is available if no overlapping bookings exist
      const isAvailable = !existingBooking;
      
      const roomWithAvailability = {
        ...room.toObject(),
        isAvailableForDates: isAvailable
      };
      
      res.json(roomWithAvailability);
    } else {
      // If no dates provided, return room without availability check
      res.json(room);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch room', error: err.message });
  }
};

// POST create a new room
exports.createRoom = async (req, res) => {
  try {
    const { title, type, description, price, discountPercent } = req.body;

    //  Validate required fields
    if (!title || !type || !description || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Thumbnail image is required.' });
    }

    // Extract filenames from uploaded files
    const uploadedFiles = req.files.map(file => file.filename);
    const [img1, img2, img3] = uploadedFiles;

    const newRoom = new Room({
      title,
      type,
      description,
      price,
      discountPercent: Number(discountPercent) || 0,
      image1: img1,
      image2: img2 || null,
      image3: img3 || null,
      facilities: req.body.facilities || []
    });

    await newRoom.save();
    res.status(201).json({ message: 'Room created successfully', room: newRoom });

  } catch (err) {
    console.error(' Error in createRoom:', err);
    res.status(500).json({ message: 'Failed to create room', error: err.message });
  }
};

// PUT update room
// exports.updateRoom = async (req, res) => {
//   try {
//     const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedRoom);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update room', error: err.message });
//   }
// };
exports.updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { title, type, description, price } = req.body;

    const updateData = { title, type, description, price };
    if (req.body.discountPercent !== undefined) {
      updateData.discountPercent = Number(req.body.discountPercent) || 0;
    }

    if (req.files && req.files.length > 0) {
      const uploadedFiles = req.files.map(file => file.filename);
      const [img1, img2, img3] = uploadedFiles;
      updateData.image1 = img1;
      updateData.image2 = img2 || null;
      updateData.image3 = img3 || null;
      updateData.facilities = req.body.facilities || [];
    }

    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true });

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update room', error: err.message });
  }
};

// Count total rooms
exports.getRoomCount = async (req, res) => {
  try {
    const count = await Room.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete room', error: err.message });
  }
};

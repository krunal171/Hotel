// /routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const upload = require('../middleware/upload');

// GET all rooms
router.get('/', roomController.getAllRooms);

// count first
router.get('/count', roomController.getRoomCount);

router.get('/:id', roomController.getRoomById);

// POST create new room - with file upload middleware and basic error handler
router.post('/', (req, res, next) => {
  upload.array('images', 3)(req, res, function(err){
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    next();
  });
}, roomController.createRoom);

// PUT update room - with file upload middleware
router.put('/:id', (req, res, next) => {
  upload.array('images', 3)(req, res, function(err){
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    next();
  });
}, roomController.updateRoom);



// DELETE room
router.delete('/:id', roomController.deleteRoom);

module.exports = router;


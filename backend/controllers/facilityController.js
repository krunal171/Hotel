const Facility = require("../models/facility");

// Create facility
exports.createFacility = async (req, res) => {
  try {
    const facility = new Facility(req.body);
    await facility.save();
    res.status(201).json(facility);
  } catch (err) {
    res.status(500).json({ message: "Error creating facility", error: err });
  }
};

// Get all facilities
exports.getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json(facilities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching facilities" });
  }
};

// In your rooms route (backend)
exports.getFacilitiesWithRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('facilities'); // Add .populate()
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete facility
exports.deleteFacility = async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Facility deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting facility" });
  }
};

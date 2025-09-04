// /models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: {type: String,required: true},
  type: {type: String,required: true},
  description: {type: String,required: true},
  price: {type: Number,required: true},
  facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Facility" }], // link facilities

  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  image1:{type: String,required: true},
  image2:{type: String},
  image3:{type: String},
  isAvailable: {type: Boolean,default: true}

  
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);

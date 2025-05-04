const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true,
  },
  latitude: {
    type: Number, // Storing as float
    required: true,
  },
  longitude: {
    type: Number, // Storing as float
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number, // Storing as integer
    required: true,
  },
  foodType: {
    type: String,
    required: true,
  },
  expiryTime: {
    type: Date, 
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  upvotes:{
    type: Number,
    default:0,
  },
  likedBy: {
    type: [String], 
    default: []
  },
});

module.exports = mongoose.model('Donation', donationSchema);

const mongoose = require("mongoose");

const recycleSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
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
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deliveryMethod: {
    type: String,
    required: true,
  },
  center: {
    type: String,
  },
  pickupDate: {
    type: Date,
  },
  pickupTime: {
    type: String,
  },
  picture: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Submitted",
  },
});

module.exports = mongoose.model("Recycle", recycleSchema);

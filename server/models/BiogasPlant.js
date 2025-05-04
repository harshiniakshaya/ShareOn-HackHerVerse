const mongoose = require("mongoose");

const biogasPlantSchema = new mongoose.Schema({
  plantId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String, required: true },   
    city: { type: String, required: true },     
    state: { type: String, required: true },   
    zipCode: { type: String, required: true },  
  },
  collectionMethods: {
    type: [String],
    enum: ["drop_off", "pickup"],
    required: true,
  },
  acceptedWasteTypes: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model('BiogasPlant', biogasPlantSchema);

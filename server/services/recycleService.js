// services/recycleService.js
const Recycle = require("../models/Recycle");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

const createRecycle = async (recycleData) => {
  try {
    const newRecycle = new Recycle(recycleData);
    await newRecycle.save();
    return newRecycle;
  } catch (error) {
    throw new Error("Error creating recycle: " + error.message);
  }
};

const getAllRecycles = async () => {
  try {
    const recycles = await Recycle.find();
    const recyclesWithDetails = await Promise.all(
      recycles.map(async (recycle) => {
        const user = await User.findOne({ userId: recycle.userId });
        return {
          ...recycle.toObject(),
          picture: recycle.picture ? recycle.picture.replace(/\\/g, "/") : null,
          userName: user ? user.name : "Unknown User",
        };
      })
    );
    return recyclesWithDetails;
  } catch (error) {
    throw new Error("Error fetching recycles: " + error.message);
  }
};


const getRecycleById = async (id) => {
  try {
    const recycle = await Recycle.findById(id);
    if (!recycle) {
      throw new Error("Recycle not found");
    }
    return recycle;
  } catch (error) {
    throw new Error("Error fetching recycle: " + error.message);
  }
};

const getRecyclesByUserId = async (userId) => {
  try {
    const recycles = await Recycle.find({ userId });
    if (recycles.length === 0) {
      return [];
    }
    const recyclesWithDetails = await Promise.all(
      recycles.map(async (recycle) => {
        const user = await User.findOne({ userId: recycle.userId });
        return {
          ...recycle.toObject(),
          picture: recycle.picture ? recycle.picture.replace(/\\/g, "/") : null,
          userName: user ? user.name : "Unknown User",
        };
      })
    );
    return recyclesWithDetails;
  } catch (error) {
    throw new Error("Error fetching recycles by userId: " + error.message);
  }
};


// const updateRecycle = async (id, recycleData) => {
//   try {
//     const updatedRecycle = await Recycle.findByIdAndUpdate(id, recycleData, {
//       new: true,
//     });
//     if (!updatedRecycle) {
//       throw new Error("Recycle not found for update");
//     }
//     return updatedRecycle;
//   } catch (error) {
//     throw new Error("Error updating recycle: " + error.message);
//   }
// };
const updateRecycle = async (id, recycleData) => {
  try {
    const existingRecycle = await Recycle.findById(id);
    if (!existingRecycle) {
      throw new Error("Recycle not found for update");
    }
    
    if (!recycleData.picture) {
      recycleData.picture = existingRecycle.picture;
    }

    const updatedRecycle = await Recycle.findByIdAndUpdate(id, recycleData, {
      new: true,
    });
    
    return updatedRecycle;
  } catch (error) {
    throw new Error("Error updating recycle: " + error.message);
  }
};


const deleteRecycle = async (id) => {
  try {
    const recycle = await Recycle.findById(id);
    if (!recycle) {
      throw new Error("Recycle not found for deletion");
    }

    if (recycle.picture) {
      const picturePath = recycle.picture.replace("http://localhost:8080/", "");
      const imagePath = path.join(__dirname, "../", picturePath);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err.message);
        }
      });
    }
    const deletedRecycle = await Recycle.findByIdAndDelete(id);
    return deletedRecycle;
  } catch (error) {
    throw new Error("Error deleting recycle: " + error.message);
  }
};

module.exports = {
  createRecycle,
  getAllRecycles,
  getRecycleById,
  updateRecycle,
  deleteRecycle,
  getRecyclesByUserId,
};

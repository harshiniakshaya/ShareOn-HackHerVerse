const Donation = require("../models/Donations"); // Ensure the model name matches your schema
const User = require("../models/User");

const createDonation = async (donationData) => {
  try {
    const newDonation = new Donation(donationData);
    await newDonation.save();
    return newDonation;
  } catch (error) {
    throw new Error("Error creating donation: " + error.message);
  }
};

// const getAllDonations = async () => {
//   try {
//     const donations = await Donation.find();
//     const baseUrl = `http://localhost:8080/`;
//     const donationsWithImages = donations.map((donation) => ({
//       ...donation.toObject(),
//       picture: baseUrl + donation.picture.replace(/\\/g, "/"), // Replace backslashes for URL compatibility
//     }));
//     return donationsWithImages;
//   } catch (error) {
//     throw new Error("Error fetching donations: " + error.message);
//   }
// };

const getAllDonations = async () => {
  try {
    const donations = await Donation.find();
    const baseUrl = `http://localhost:8080/`;
    const donationsWithDetails = await Promise.all(
      donations.map(async (donation) => {
        const user = await User.findOne({ userId: donation.userId });

        return {
          ...donation.toObject(),
          picture: baseUrl + donation.picture.replace(/\\/g, "/"),
          userName: user ? user.name : "Unknown User",
        };
      })
    );
    return donationsWithDetails;
  } catch (error) {
    throw new Error("Error fetching donations: " + error.message);
  }
};

const getDonationsByUserId = async (userId) => {
  try {
    const donations = await Donation.find({ userId });
    const baseUrl = `http://localhost:8080/`;
    const donationsWithDetails = await Promise.all(
      donations.map(async (donation) => {
        const user = await User.findOne({ userId: donation.userId });

        return {
          ...donation.toObject(),
          picture: baseUrl + donation.picture.replace(/\\/g, "/"),
          userName: user ? user.name : "Unknown User",
        };
      })
    );
    return donationsWithDetails;
  } catch (error) {
    throw new Error("Error fetching donations by userId: " + error.message);
  }
};

const getDonationById = async (id) => {
  try {
    const donation = await Donation.findById(id);
    if (!donation) {
      throw new Error("Donation not found");
    }
    return donation;
  } catch (error) {
    throw new Error("Error fetching donation: " + error.message);
  }
};

const updateDonation = async (id, donationData) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(id, donationData, {
      new: true,
    });
    if (!updatedDonation) {
      throw new Error("Donation not found for update");
    }
    return updatedDonation;
  } catch (error) {
    throw new Error("Error updating donation: " + error.message);
  }
};

const deleteDonation = async (id) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(id);
    if (!deletedDonation) {
      throw new Error("Donation not found for deletion");
    }
    return deletedDonation;
  } catch (error) {
    throw new Error("Error deleting donation: " + error.message);
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  getDonationsByUserId,
};

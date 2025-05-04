const {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  getDonationsByUserId,
} = require("../services/donationService");

const createDonationController = async (req, res) => {
  try {
    const picturePath = req.file ? req.file.path : null;
    const donationData = {
      ...req.body,
      picture: picturePath,
    };
    const newDonation = await createDonation(donationData);
    res.status(201).json({
      message: "Donation created successfully",
      donation: newDonation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create donation" });
  }
};

const getAllDonationsController = async (req, res) => {
  try {
    const donations = await getAllDonations();
    res.status(200).json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

const getDonationByIdController = async (req, res) => {
  try {
    const donation = await getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    res.status(200).json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch donation" });
  }
};

const getDonationsByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const donations = await getDonationsByUserId(userId);
    if (donations.length === 0) {
      return res
        .status(404)
        .json({ message: "No donations found for this user" });
    }

    res.status(200).json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch donations for user" });
  }
};

const updateDonationController = async (req, res) => {
  try {
    console.log(req.body);
    const updatedDonation = await updateDonation(req.params.id, req.body);
    if (!updatedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    res.status(200).json({
      message: "Donation updated successfully",
      donation: updatedDonation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update donation" });
  }
};

const deleteDonationController = async (req, res) => {
  try {
    const deletedDonation = await deleteDonation(req.params.id);
    if (!deletedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete donation" });
  }
};

module.exports = {
  createDonationController,
  getAllDonationsController,
  getDonationByIdController,
  getDonationsByUserIdController,
  updateDonationController,
  deleteDonationController,
};

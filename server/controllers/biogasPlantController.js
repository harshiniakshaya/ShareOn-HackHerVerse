const biogasPlantService = require("../services/biogasPlantService");

const createBiogasPlantController = async (req, res) => {
  try {
    const newPlant = await biogasPlantService.createBiogasPlant(req.body);
    res
      .status(201)
      .json({ message: "Biogas plant created successfully", plant: newPlant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create biogas plant" });
  }
};

const getAllBiogasPlantsController = async (req, res) => {
  try {
    const plants = await biogasPlantService.getAllBiogasPlants();
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch biogas plants" });
  }
};

const getBiogasPlantByIdController = async (req, res) => {
  try {
    const { plantId } = req.params;
    const plant = await biogasPlantService.getBiogasPlantById(plantId);

    if (!plant) {
      return res.status(404).json({ message: "Biogas plant not found" });
    }

    res.status(200).json(plant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch biogas plant" });
  }
};

const updateBiogasPlantController = async (req, res) => {
  try {
    const { plantId } = req.params;
    const updatedPlant = await biogasPlantService.updateBiogasPlant(
      plantId,
      req.body
    );

    if (!updatedPlant) {
      return res.status(404).json({ message: "Biogas plant not found" });
    }

    res.status(200).json({
      message: "Biogas plant updated successfully",
      plant: updatedPlant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update biogas plant" });
  }
};

const deleteBiogasPlantController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlant = await biogasPlantService.deleteBiogasPlant(id);

    if (!deletedPlant) {
      return res.status(404).json({ message: "Biogas plant not found" });
    }

    res.status(200).json({ message: "Biogas plant deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete biogas plant" });
  }
};

module.exports = {
  createBiogasPlantController,
  getAllBiogasPlantsController,
  getBiogasPlantByIdController,
  updateBiogasPlantController,
  deleteBiogasPlantController,
};

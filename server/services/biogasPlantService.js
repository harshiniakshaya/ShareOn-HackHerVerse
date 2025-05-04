const BiogasPlant = require("../models/BiogasPlant");
const Recycle = require("../models/Recycle");
const { createUser, getUserById } = require("./userService");

const generateUniquePlantId = async () => {
  let nextPlantId;
  const latestPlant = await BiogasPlant.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );
  if (latestPlant) {
    const currentNumber = parseInt(latestPlant.plantId.slice(2), 10);
    const nextNumber = currentNumber + 1;
    nextPlantId = `BP${nextNumber.toString().padStart(6, "0")}`;
  } else {
    nextPlantId = "BP000001";
  }

  while (await BiogasPlant.exists({ plantId: nextPlantId })) {
    const currentNumber = parseInt(nextPlantId.slice(2), 10);
    const nextNumber = currentNumber + 1;
    nextPlantId = `BP${nextNumber.toString().padStart(6, "0")}`;
  }

  return nextPlantId;
};

const createBiogasPlant = async (plantData) => {
  try {
    const nextPlantId = await generateUniquePlantId();
    const newPlant = new BiogasPlant({
      ...plantData,
      plantId: nextPlantId,
    });
    await newPlant.save();
    const userData = {
      userId: nextPlantId,
      name: plantData.name,
      email: plantData.email,
      password: plantData.password,
      role: "biogasplant",
    };
    await createUser(userData);

    return newPlant;
  } catch (error) {
    throw new Error(`Error creating biogas plant and user: ${error.message}`);
  }
};

const getAllBiogasPlants = async () => {
  try {
    return await BiogasPlant.find();
  } catch (error) {
    throw new Error("Error fetching all biogas plants");
  }
};

const getBiogasPlantById = async (plantId) => {
  try {
    const plant = await BiogasPlant.findOne({ plantId });
    if (!plant) throw new Error("Biogas plant not found");
    return plant;
  } catch (error) {
    throw new Error(`Error fetching biogas plant by ID: ${error.message}`);
  }
};

const updateBiogasPlant = async (id, updateData) => {
  try {
    const existingPlant = await BiogasPlant.findOne({ id });
    if (!existingPlant) throw new Error("Biogas plant not found");

    const updatedPlant = await BiogasPlant.findOneAndUpdate(
      { id },
      updateData,
      { new: true }
    );
    return updatedPlant;
  } catch (error) {
    throw new Error(`Error updating biogas plant: ${error.message}`);
  }
};

const deleteBiogasPlant = async (id) => {
  try {
    const deletedPlant = await BiogasPlant.findOneAndDelete(id);
    if (!deletedPlant) throw new Error("Biogas plant not found");

    return deletedPlant;
  } catch (error) {
    throw new Error(`Error deleting biogas plant: ${error.message}`);
  }
};


module.exports = {
  createBiogasPlant,
  getAllBiogasPlants,
  getBiogasPlantById,
  updateBiogasPlant,
  deleteBiogasPlant,
};

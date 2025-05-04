const {
  createRecycle,
  getAllRecycles,
  getRecycleById,
  getRecyclesByUserId,
  updateRecycle,
  deleteRecycle,
} = require("../services/recycleService");

const createRecycleController = async (req, res) => {
  try {
    const picturePath = req.file ? `uploads/${req.file.filename}` : null;
    const recycleData = {
      ...req.body,
      picture: picturePath,
    };
    const newRecycle = await createRecycle(recycleData);
    res.status(201).json({
      message: "Recycle created successfully",
      recycle: newRecycle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create recycle" });
  }
};

const getAllRecyclesController = async (req, res) => {
  try {
    const recycles = await getAllRecycles();
    res.status(200).json(recycles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recycles" });
  }
};

const getRecycleByIdController = async (req, res) => {
  try {
    const recycle = await getRecycleById(req.params.id);
    if (!recycle) {
      return res.status(404).json({ error: "Recycle not found" });
    }
    res.status(200).json(recycle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recycle" });
  }
};

const getRecyclesByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const recycles = await getRecyclesByUserId(userId);
    // console.log(recycles)
    // if (recycles.length === 0) {
    //   console.log("no")
    //   return res
    //     .status(404)
    //     .json({ message: "No recycles found for this user" });
    // }
    res.status(200).json(recycles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recycles for user" });
  }
};

const updateRecycleController = async (req, res) => {
  try {
    console.log(req.body)
    const updatedRecycle = await updateRecycle(req.params.id, req.body);
    if (!updatedRecycle) {
      return res.status(404).json({ error: "Recycle not found" });
    }
    res.status(200).json({
      message: "Recycle updated successfully",
      recycle: updatedRecycle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update recycle" });
  }
};

const deleteRecycleController = async (req, res) => {
  try {
    const deletedRecycle = await deleteRecycle(req.params.id);
    if (!deletedRecycle) {
      return res.status(404).json({ error: "Recycle not found" });
    }
    res.status(200).json({ message: "Recycle deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete recycle" });
  }
};

module.exports = {
  createRecycleController,
  getAllRecyclesController,
  getRecycleByIdController,
  getRecyclesByUserIdController,
  updateRecycleController,
  deleteRecycleController,
};

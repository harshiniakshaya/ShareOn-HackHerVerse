const {
  dataAggregationService,
  aggregateRecycleDataByUserId,
} = require("../services/dataAggregationService");

class DataAggregationController {
  async getAggregatedData(req, res) {
    try {
      const aggregatedData = await dataAggregationService.aggregateData();
      res.status(200).json(aggregatedData);
    } catch (error) {
      console.error("Error fetching aggregated data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getRecycleDataByUserId(req, res) {
    const { userId } = req.params;
    try {
      const recycleData = await aggregateRecycleDataByUserId(userId);
      res.status(200).json(recycleData);
    } catch (error) {
      console.error("Error fetching recycle data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new DataAggregationController();

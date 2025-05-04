const { getUserById } = require('./userService');
const Donation = require('../models/Donations.js');
const Recycle = require('../models/Recycle.js');

class DataAggregationService {
  async aggregateData() {
    const years = await Donation.distinct("createdAt").then(dates => {
      return [...new Set(dates.map(date => new Date(date).getFullYear()))]; // Get unique years
    });

    const aggregatedData = { data: [] };

    for (const year of years) {
      const yearData = { year: year, months: [] };

      for (let month = 1; month <= 12; month++) {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0); 

        const totalDonations = await Donation.countDocuments({
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        });
        const totalActiveDonations = await Donation.countDocuments({
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
          expiryTime: { $gt: new Date() },
        });
        const totalExpiredDonations = totalDonations - totalActiveDonations;
        const totalRecycles = await Recycle.countDocuments({
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        });
        yearData.months.push({
          month: month,
          totalDonations,
          totalRecycles,
          totalActiveDonations,
          totalExpiredDonations,
        });
      }
      aggregatedData.data.push(yearData);
    }
    return aggregatedData;
  }
}

const aggregateRecycleDataByUserId = async (userId) => {
  try {
    const user = await getUserById(userId);
    if (!user || !user.name) throw new Error("Biogas plant not found for user");
    const centerName = user.name;

    const recycleData = await Recycle.aggregate([
      { $match: { center: centerName } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          counts: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          months: {
            $push: {
              month: "$_id.month",
              counts: "$counts",
            },
          },
        },
      },
      { $sort: { _id: 1, "months.month": 1 } },
    ]);
    const formattedData = {
      data: [],
    };

    recycleData.forEach((yearData) => {
      const year = yearData._id;
      const months = Array.from({ length: 12 }, (_, index) => {
        const monthNumber = index + 1;
        const monthCounts = yearData.months.find(m => m.month === monthNumber)?.counts || [];

        const monthSummary = {
          month: monthNumber,
          submitted: monthCounts.find(c => c.status === "Submitted")?.count || 0,
          acknowledged: monthCounts.find(c => c.status === "Acknowledged")?.count || 0,
          accepted: monthCounts.find(c => c.status === "Accepted")?.count || 0,
          rejected: monthCounts.find(c => c.status === "Rejected")?.count || 0,
        };

        return monthSummary;
      });

      formattedData.data.push({ year, months });
    });

    return formattedData;
  } catch (error) {
    throw new Error(`Error in recycle data aggregation: ${error.message}`);
  }
};


module.exports = {
  dataAggregationService: new DataAggregationService(),
  aggregateRecycleDataByUserId,
};

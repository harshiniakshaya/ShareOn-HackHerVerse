import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Loader from "@/components/custom/Loader/Loader";

const chartConfig = {
  submitted: {
    label: "Submitted",
    color: "#FFA500",
  },
  acknowledged: {
    label: "Acknowledged",
    color: "#FFD700", 
  },
  accepted: {
    label: "Accepted",
    color: "#008000",
  },
  rejected: {
    label: "Rejected",
    color: "#FF0000",
  },
};

const BiogasPlantDashboard = () => {
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const baseURL = "http://localhost:8080";

  useEffect(() => {
    const fetchUserDataAndRequests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `${baseURL}/api/biogasplants/data-aggregation/${userId}`
        );
        const donationData = response.data;
        const availableYears = donationData.data.map((item) => item.year);
        setYears([...new Set(availableYears)]);

        updateChartData(donationData.data, selectedYear);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndRequests();
  }, [selectedYear]);

  const updateChartData = (data, year) => {
    const yearData = data.find((item) => item.year === year);
    if (yearData) {
      const preparedData = yearData.months.map((monthData) => ({
        month: new Intl.DateTimeFormat("en-US", { month: "long" }).format(
          new Date(year, monthData.month - 1)
        ),
        submitted: monthData.submitted,
        acknowledged: monthData.acknowledged,
        accepted: monthData.accepted,
        rejected: monthData.rejected,
      }));
      setChartData(preparedData);
    }
  };

  const handleYearChange = (value) => {
    const year = parseInt(value);
    setSelectedYear(year);
    updateChartData(chartData, year);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="mt-[80px] mb-[40px]">Error: {error}</div>;
  }

  return (
    <div className="mt-[80px] mb-[40px] px-[50px]">
      <h1 className="text-2xl font-semibold mb-5">Biogas Plant Dashboard</h1>
      <div className="mb-4 flex items-center gap-2">
        <Label htmlFor="year">Year</Label>
        <Select
          onValueChange={handleYearChange}
          value={selectedYear.toString()}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Years</SelectLabel>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-gray-100 px-5 py-5">
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[500px] w-full"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              className="bg-white"
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="submitted"
              fill={chartConfig.submitted.color}
              radius={4}
            />
             <Bar
              dataKey="acknowledged"
              fill={chartConfig.acknowledged.color} 
              radius={4}
            />
            <Bar
              dataKey="accepted"
              fill={chartConfig.accepted.color}
              radius={4}
            />
            <Bar
              dataKey="rejected"
              fill={chartConfig.rejected.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default BiogasPlantDashboard;

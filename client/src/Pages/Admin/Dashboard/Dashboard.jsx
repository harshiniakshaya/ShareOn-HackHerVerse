import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios";
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
  totalDonations: {
    label: "Total Donations ",
    color: "#FFA500", // Orange
  },
  totalRecycles: {
    label: "Total Recycles ",
    color: "#008000", // Green
  },
  totalActiveDonations: {
    label: "Total Active Donations ",
    color: "#FFFF00", // Yellow
  },
  totalExpiredDonations: {
    label: "Total Expired Donations ",
    color: "#A52A2A", // Brown
  },
};

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/data-aggregation"
        );
        const donationData = response.data;

        const availableYears = donationData.data.map((item) => item.year);
        setYears([...new Set(availableYears)]); 
        updateChartData(donationData.data, selectedYear);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentYear]);

  const updateChartData = (data, year) => {
    const yearData = data.find((item) => item.year === year);
    if (yearData) {
      const preparedData = yearData.months.map((monthData) => ({
        month: new Intl.DateTimeFormat("en-US", { month: "long" }).format(
          new Date(year, monthData.month - 1)
        ),
        totalDonations: monthData.totalDonations,
        totalRecycles: monthData.totalRecycles,
        totalActiveDonations: monthData.totalActiveDonations,
        totalExpiredDonations: monthData.totalExpiredDonations,
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
      <h1 className="text-2xl font-semibold mb-5">Dashboard</h1>
      <div className="mb-4 flex items-center gap-2">
        <Label htmlFor="year">Year</Label>
        <Select onValueChange={handleYearChange} value={selectedYear.toString()}>
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
              dataKey="totalDonations"
              fill={chartConfig.totalDonations.color}
              radius={4}
            />
            <Bar
              dataKey="totalRecycles"
              fill={chartConfig.totalRecycles.color}
              radius={4}
            />
            <Bar
              dataKey="totalActiveDonations"
              fill={chartConfig.totalActiveDonations.color}
              radius={4}
            />
            <Bar
              dataKey="totalExpiredDonations"
              fill={chartConfig.totalExpiredDonations.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;

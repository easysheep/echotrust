import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns"; // For formatting dates

const LineChartComp = ({ reviews }) => {
  const [chartData, setChartData] = useState([]);

  // Helper function to group reviews by date (daily or monthly)
  const groupByDate = (data, interval = "day") => {
    const grouped = data.reduce((acc, review) => {
      const date = format(
        parseISO(review.createdAt),
        interval === "day" ? "yyyy-MM-dd" : "yyyy-MM"
      );
      if (!acc[date]) {
        acc[date] = { date, count: 0, totalStars: 0 };
      }
      acc[date].count += 1;
      acc[date].totalStars += review.stars;
      return acc;
    }, {});

    return Object.values(grouped).map((entry) => ({
      date: entry.date,
      reviewCount: entry.count,
      averageRating: (entry.totalStars / entry.count).toFixed(1), // Calculate average rating
    }));
  };

  useEffect(() => {
    if (reviews.length > 0) {
      // Group reviews by daily
      const data = groupByDate(reviews, "day"); // You can change "day" to "month" for monthly view
      setChartData(data);
      console.log("Processed Chart Data:", data); // Log the data
    }
  }, [reviews]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => format(parseISO(tick), "MMM dd")}
          />
          <YAxis
            yAxisId="left"
            label={{ value: "Reviews", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Average Rating",
              angle: -90,
              position: "insideRight",
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="reviewCount"
            stroke="#8884d8"
            name="Reviews"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="averageRating"
            stroke="#82ca9d"
            name="Avg Rating"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComp;

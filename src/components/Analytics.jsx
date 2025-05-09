
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";
const Analytics = ({ reviews }) => {
  // Group reviews by star rating and create data for line chart
  const createChartData = () => {
    const starRatings = [1, 2, 3, 4, 5];
    const chartData = starRatings.map((stars) => {
      const count = reviews.filter((review) => review.stars === stars).length;
      return { stars: `${stars} Stars`, count: count };
    });
    return chartData;
  };

  const chartData = createChartData();

  return (
    <div>

      <RadarChart outerRadius={150} width={600} height={400} data={chartData} >
        <PolarGrid />
        <PolarAngleAxis dataKey="stars" stroke="white" />
        <PolarRadiusAxis />
        <Tooltip />
        <Radar
          name="Reviews"
          dataKey="count"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </div>
  );
};

export default Analytics;

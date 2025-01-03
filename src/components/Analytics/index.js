import React from "react";
import { Line } from "react-chartjs-2";
import Sidebar from "../Sidebar";
import Header from "../Header";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  // Chart data configuration
  const data = {
    labels: ["10 AM", "1 PM", "4 PM", "7 PM", "10 PM"], // X-axis labels
    datasets: [
      {
        label: "Stock Value", // Dataset label
        data: [4200, 4250, 4300, 4350, 4400], // Y-axis values
        fill: true, // Area under the line is filled
        backgroundColor: "rgba(91, 132, 255, 0.2)", // Background color
        borderColor: "rgba(91, 132, 255, 1)", // Line color
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        display: true, // Show the legend
        position: "top", // Legend position
      },
      title: {
        display: true, // Show the title
        text: "Stock Portfolio Over Time", // Title text
      },
    },
    scales: {
      x: {
        type: "category", // Define X-axis as category
        title: {
          display: true,
          text: "Time of Day",
        },
      },
      y: {
        type: "linear", // Define Y-axis as linear
        title: {
          display: true,
          text: "Stock Value",
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
    <div className="w-full lg:w-64">
      <Sidebar />
    </div>
    <div className="flex-1 flex flex-col">
      <Header />
        <h2 className="text-gray-600 mb-4">Reports and Analytics</h2>
        <Line data={data} options={options} /> {/* Render Line Chart */}
      </div>
    </div>
  );
};

export default Analytics;

import React from "react";
import { Line } from "react-chartjs-2";

const StockPortfolio = () => {
  const data = {
    labels: ["10 AM", "1 PM", "4 PM", "7 PM", "10 PM"],
    datasets: [
      {
        label: "Stock Value",
        data: [4200, 4250, 4300, 4350, 4400],
        fill: true,
        backgroundColor: "rgba(91, 132, 255, 0.2)",
        borderColor: "rgba(91, 132, 255, 1)",
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-gray-600 mb-4">Stock Portfolio</h2>
      <Line data={data} />
    </div>
  );
};

export default StockPortfolio;

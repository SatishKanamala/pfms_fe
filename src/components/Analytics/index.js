import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import Sidebar from "../Sidebar";
import Header from "../Header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Cookies from "js-cookie";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [transactionData, setTransactionData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [goalsData, setGoalsData] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("auth_token");

        const headers = { Authorization: `Bearer ${token}` };
        const transactionRes = await axios.get("http://localhost:8000/api/v1/transaction/income/get_all", { headers });
        
  
        // Check if the data is available and set the chart data
        if (transactionRes.data.data && transactionRes.data.data.length > 0) {
          const transactionLabels = transactionRes.data.data.map(item => item.category);
          const transactionValues = transactionRes.data.data.map(item => item.amount);
          
          setTransactionData({
            labels: transactionLabels,
            datasets: [{
              data: transactionValues,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733", "#48C9B0"],
              
            }]
          });
        } else {
          setTransactionData(null); // No data
        }
  
        const budgetRes = await axios.get("http://localhost:8000/api/v1/budget/get_all", { headers });
        console.log("Budget Data:", budgetRes.data.data);

        if (budgetRes.data.data && budgetRes.data.data.length > 0) {
          const budgetLabels = budgetRes.data.data.map(item => item.category);
          const budgetValues = budgetRes.data.data.map(item => item.amount);
          
          setBudgetData({
            labels: budgetLabels,
            datasets: [{
              label: "Budget",
              data: budgetValues,
              backgroundColor: "#4CAF50",
            }]
          });
        } else {
          setBudgetData(null);
        }
  
        const goalsRes = await axios.get("http://localhost:8000/api/v1/goal/get_all", { headers });
        console.log("Goals Data:", goalsRes.data.data);

        if (goalsRes.data.data && goalsRes.data.data.length > 0) {
          const goalsLabels = goalsRes.data.data.map(item => item.goal_name);
          const goalsValues = goalsRes.data.data.map(item => item.amount);
          
          setGoalsData({
            labels: goalsLabels,
            datasets: [{
              label: "Goals",
              data: goalsValues,
              backgroundColor: "#FFC107",
              
            }]
          });
        } else {
          setGoalsData(null);
        }
        
        const investmentRes = await axios.get("http://localhost:8000/api/v1/investment/get_all", { headers });
        console.log("Investment Data:", investmentRes.data.data);

        if (investmentRes.data.data && investmentRes.data.data.length > 0) {
          const investmentLabels = investmentRes.data.data.map(item => item.category);
          const investmentValues = investmentRes.data.data.map(item => item.initial_amount);
          
          setInvestmentData({
            labels: investmentLabels,
            datasets: [{
              data: investmentValues,
              backgroundColor: ["#1E88E5", "#D32F2F", "#7B1FA2", "#0288D1"],
            }]
          });
        } else {
          setInvestmentData(null);
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  const downloadExcel = (category) => {
    axios
      .get(`/api/${category}/download`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${category}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error("Download error:", error));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <br /><br /><br /><br /><br />
        <div className="p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
    {/* Transaction Data */}
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-bold mb-2">
        Transactions{" "}
        <button
          className="text-blue-500"
          onClick={() => downloadExcel("transactions")}
        >
          Download
        </button>
      </h3>
      {transactionData && transactionData.labels.length > 0 ? (
        <div style={{ width: "300px", height: "300px" }}>
        <Pie data={transactionData} />
        </div>
      ) : (
        <p>No data available for transactions</p>
      )}
    </div>

    {/* Budget Data */}
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-bold mb-2">
        Budget{" "}
        <button
          className="text-blue-500"
          onClick={() => downloadExcel("budget")}
        >
          Download
        </button>
      </h3>
      {budgetData && budgetData.labels.length > 0 ? (
        <Bar data={budgetData} />
      ) : (
        <p>No data available for budget</p>
      )}
    </div>

    {/* Goals Data */}
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-bold mb-2">
        Goals{" "}
        <button
          className="text-blue-500"
          onClick={() => downloadExcel("goals")}
        >
          Download
        </button>
      </h3>
      {goalsData && goalsData.labels.length > 0 ? (
        <Bar data={goalsData} />
      ) : (
        <p>No data available for goals</p>
      )}
    </div>

    {/* Investment Data */}
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-bold mb-2">
        Investments{" "}
        <button
          className="text-blue-500"
          onClick={() => downloadExcel("investments")}
        >
          Download
        </button>
      </h3>
      {investmentData && investmentData.labels.length > 0 ? (
        <div style={{ width: "200px", height: "200px" }}>
        <Pie data={investmentData} />
        </div>
      ) : (
        <p>No data available for investments</p>
      )}
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default Analytics;

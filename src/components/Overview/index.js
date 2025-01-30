import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Overview = () => {
  const [balanceData, setBalanceData] = useState({ balance: 0, income: 0, expenses: 0 });
  const [transactionData, setTransactionData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const token = Cookies.get("auth_token");

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/reports/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.data) {
        setBalanceData({
          balance: response.data.data.balance,
          income: response.data.data.Income,
          expenses: response.data.data.expenses,
        });
      } else {
        setMessage("No balance data found.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred while fetching balance data.");
      setMessageType("error");
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/reports/recent-transaction", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setTransactionData(response.data.data);
      } else {
        setMessage("No recent transaction data found.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred while fetching transaction data.");
      setMessageType("error");
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/reports/transaction-details", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.data)) {
        const categories = response.data.data.map((item) => item.category_name);
        const budgetAmounts = response.data.data.map((item) => item.actual_amount);
        const totalExpenses = response.data.data.map((item) => item.spending_amount);
          setChartData({
          labels: categories,
          datasets: [
            {
              label: "Actual Budget",
              data: budgetAmounts,
              backgroundColor: "rgba(77, 173, 237, 0.6)",
            },
            {
              label: "Spendings",
              data: totalExpenses,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        });
      } else {
        setMessage("No chart data found.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred while fetching chart data.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    fetchReports();
    fetchTransactions();
    fetchChartData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-gray-600">Balance</h2>
          <p className="text-xl font-bold">
            {isBalanceLoading ? "Loading..." : `Rs.${balanceData.balance.toLocaleString()}/-`}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-gray-600">Income</h2>
          <p className="text-xl font-bold">
            {isBalanceLoading ? "Loading..." : `Rs.${balanceData.income.toLocaleString()}/-`}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-gray-600">Expenses</h2>
          <p className="text-xl font-bold">
            {isBalanceLoading ? "Loading..." : `Rs.${balanceData.expenses.toLocaleString()}/-`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-gray-600 text-lg font-bold mb-2">Recent Transactions</h2>
      {isTransactionLoading ? (
        <p>Loading...</p>
      ) : transactionData.length > 0 ? (
        <div className="space-y-4">
          {transactionData.map((transaction, index) => {
            const [date, time] = transaction.created_at.split("T");
            const isIncome = transaction.type === "Income";
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col text-sm text-gray-700">
                  <p>{date} / {time}</p>
                </div>
                <div className="flex flex-col text-sm text-gray-700">
                  <p>
                    <span className="font-bold">
                      {transaction.bank_name} - {transaction.account_number}
                    </span>
                  </p>
                </div>
                <p
                  className={`text-sm font-bold ${
                    isIncome ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isIncome ? "+" : "-"} Rs. {transaction.amount.toLocaleString()}/-
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No recent transactions available.</p>
      )}
    </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-gray-600 text-lg font-bold mb-2">Actual Budget vs Spendings</h2>
          {chartData.labels ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  // title: {
                  //   display: true,
                  //   text: "Budget vs Expenses by Category",
                  // },
                },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>

      {message && <div className={`alert ${messageType}`}>{message}</div>}
    </>
  );
};

export default Overview;

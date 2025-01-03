import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import Cookies from "js-cookie";

const Overview = () => {
  const [data, setData] = useState({ balance: 0, income: 0, expenses: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 
  const token = Cookies.get("auth_token"); 
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/reports/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.data) {
        setData({
          balance: response.data.data.balance,
          income: response.data.data.Income,
          expenses: response.data.data.expenses,
        });
      } else {
        setMessage("No goals found.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error fetching goals:", error.response.data.error);
      setMessage(error.response.data.error || "An error occurred while fetching goals data.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
        fetchData();
      }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-gray-600">Balance</h2>
        <p className="text-xl font-bold">Rs.{data.balance}/-</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-gray-600">Income</h2>
        <p className="text-xl font-bold">Rs.{data.income}/-</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-gray-600">Expenses</h2>
        <p className="text-xl font-bold">Rs.{data.expenses}/-</p>
      </div>
    </div>
  );
};

export default Overview;

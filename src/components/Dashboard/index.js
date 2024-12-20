import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../Sidebar";
import Header from "../Header";
import Overview from "../Overview";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Function to fetch data from the backend
    const fetchData = async () => {
      try {
        // Make API request to get the data (adjust the endpoint as needed)
        const response = await axios.get("http://localhost:8000/api/v1/dashboard");

        // Check if data exists
        if (response.data && response.data.length === 0) {
          setErrorMessage("No data found. Would you like to create new data?");
        } else {
          setData(response.data);
        }
      } catch (error) {
        setErrorMessage("Error fetching data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <>
      <Header />
      <Sidebar />
      <Overview />
    </>
  );
};

export default Dashboard;

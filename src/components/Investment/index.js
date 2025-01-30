import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';
import axios from "axios";
import Cookies from "js-cookie";

import Sidebar from "../Sidebar";
import Header from "../Header";
import './index.css'

function Investment() {
  const [isLoading, setIsLoading] = useState(true); 
  const [deleteInvestmentId, setdeleteInvestmentId] = useState(null); 
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    type: "",
    category: "",
    purchase_date: "",
    initial_amount: "",
    current_value: "",
    return_value: "",
  });
  const [data, setData] = useState([]); 
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const token = Cookies.get("auth_token"); 
  
  
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const apiKey = "VOS61UO4VNQNX7V4"; // Replace with your API key
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${apiKey}`
      );
      const data = await response.json();
      const results = data.bestMatches || [];

      if (results.length > 0) {
        setSuggestions(
          results.map((item) => ({
            name: item["2. name"],
            symbol: item["1. symbol"],
          }))
        );
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, name: suggestion.name });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100); // Delay to allow suggestion click
  };

  const fetchData = async () => {
    try {
        const response = await axios.get("http://localhost:8000/api/v1/investment/get_all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          setMessage("No data found.");
          setMessageType("error");
        }
      } catch (error) {
        console.error("Error fetching data:", error.response.data.error);
        setMessage(error.response.data.error || "An error occurred while fetching investment data.");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const togglePopup = (investment = null) => {
    if (investment) {
      setFormData(investment);
    } else {
      setFormData({
        id: null,
        name: "",
        type: "",
        category: "",
        purchase_date: "",
        initial_amount: "",
      });
    }
    setIsPopupOpen(!isPopupOpen);
  };

  const toggleDeletePopup = (investmentId) => {
    setdeleteInvestmentId(investmentId);
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (formData.id) {
        // Update investment API call
        response = await axios.put(`http://localhost:8000/api/v1/investment/update/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(response.data.message || "Updated successfully!");
        setMessageType("success");

        // Update state directly to reflect changes (this helps with single record update)
        setData(prevData => prevData.map(item => (item.id === formData.id ? { ...item, ...formData } : item)));
      } else {
        // Add investment API call
        response = await axios.post("http://localhost:8000/api/v1/investment/create", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage(response.data.message || "Created successfully!");
        setMessageType("success");

        // Add new investment to state
        setData([...data, response.data]);
        fetchData();
      }
      togglePopup();
    } catch (error) {
      setMessage(error.response.data.error || "An error occurred while processing the request.");
      setMessageType("error");
    }
  };


  const handleDelete = async () => {
    if (!deleteInvestmentId) return;
    
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/investment/delete/${deleteInvestmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || "Deleted successfully!");
      setMessageType("success");

      // Remove deleted investment from state
      setData(prevData => prevData.filter(item => item.id !== deleteInvestmentId));
      setIsDeletePopupOpen(false); 
    } catch (error) {
      setMessage(error.response.data.error || "An error occurred while deleting the investment.");
      setMessageType("error");
      setIsDeletePopupOpen(false); 
    }
  };
  useEffect(() => {
      fetchData();
    //   fetchaccount(); // Fetch account when component mounts
    //   fetchcategory();
    }, []);
  
    useEffect(() => {
      if (message) {
        const timer = setTimeout(() => {
          setMessage("");
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [message]);
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <br/><br/><br/><br/><br/>
       {/* Show message at the top */}
              {message && (
                <div
                  className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-xl p-4 mb-4 text-white rounded-lg flex items-center ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}
                  style={{ maxWidth: '400px', wordWrap: 'break-word' }}
                >
                  <div className="mr-3">
                    {messageType === "success" ? (
                      <FiCheckCircle size={24} />
                    ) : (
                      <FiXCircle size={24} />
                    )}
                  </div>
                  <div className="flex-grow">{message}</div>
                </div>
              )}
      
              <div className="mt-6 mr-6 flex justify-end">
                <button
                  onClick={() => togglePopup()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  Add Investment
                </button>
              </div>

            <div className="flex-1 p-6 space-y-6 relative">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <ThreeDots
                      height="20"
                      width="20"
                      color="blue"
                      ariaLabel="tail-spin-loading"
                      radius="3"
                      wrapperClass="flex justify-center items-center"
                    />
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center">
                    <div>
                      <img
                        src="images/no_data.png"
                        alt="No Data"
                        className="max-w-xs w-full mx-auto"
                      />
                    </div>
                  </div>
                ) : (
        <table className="table-auto w-full bg-white rounded-lg shadow-md border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 ">S.No</th>
              <th className="px-4 py-2 ">Name</th>
              <th className="px-4 py-2 ">Type</th>
              <th className="px-4 py-2 ">Category</th>
              <th className="px-4 py-2 ">Purchase Date</th>
              <th className="px-4 py-2 ">Initial Amount</th>
              <th className="px-4 py-2 ">Current Value</th>
              <th className="px-4 py-2 ">Return Value</th>
              <th className="px-4 py-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((investment, index) => {
                return (
              <tr key={investment.id } className="border-t">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 border">{investment.name}</td>
                <td className="px-4 py-2 border">{investment.type}</td>
                <td className="px-4 py-2 border">{investment.category}</td>
                <td className="px-4 py-2 border">{investment.purchase_date}</td>
                <td className="px-4 py-2 border">{investment.initial_amount}</td>
                <td className="px-4 py-2 border">{investment.current_value || "N/A"}</td>
                <td className="px-4 py-2 border">{investment.return_value || "N/A"}</td>
                <td className="border px-4 py-2 space-x-2">
                      <div className="flex space-x-2">
                        {/* Update Icon */}
                        <span
                          onClick={() => togglePopup(investment)}
                          className="text-blue-500 cursor-pointer hover:text-yellow-600 mx-2"
                        >
                          <FiEdit  />
                        </span>

                        {/* Delete Icon */}
                        <span
                          onClick={() => toggleDeletePopup(investment.id)}
                          className="text-red-500 cursor-pointer hover:text-red-600 mx-2"
                        >
                          <FiTrash2  />
                        </span>
                      </div>
                    </td>
                                  </tr>
                                );
                            })}
                          </tbody>
                          </table>
                        )}
                      </div>

        {/* Add/Edit Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {formData.id ? "Update Investment" : "Add Investment"}
              </h3>
              <form onSubmit={handleSubmit}>
              <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Investment Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    placeholder="Enter investment name"
                  />
                  {showSuggestions && (
                    <ul className="border border-gray-300 rounded-md mt-1 bg-white z-10 absolute max-h-48 overflow-auto">
                      {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.name} ({suggestion.symbol})
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-500">No suggestions found</li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                    Type
                </label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                >
                    <option value="" disabled>Select Investment Type</option>

                    {/* Equity Investments */}
                    <optgroup label="Equity Investments">
                    <option value="Stocks">Stocks</option>
                    <option value="Equity Mutual Funds">Equity Mutual Funds</option>
                    <option value="Index Funds">Index Funds</option>
                    <option value="Exchange-Traded Funds (ETFs)">Exchange-Traded Funds (ETFs)</option>
                    <option value="Venture Capital">Venture Capital</option>
                    <option value="Private Equity">Private Equity</option>
                    </optgroup>

                    {/* Fixed-Income Investments */}
                    <optgroup label="Fixed-Income Investments">
                    <option value="Government Bonds">Government Bonds</option>
                    <option value="Corporate Bonds">Corporate Bonds</option>
                    <option value="Municipal Bonds">Municipal Bonds</option>
                    <option value="Junk Bonds">Junk Bonds</option>
                    <option value="Fixed Deposit (FD)">Fixed Deposit (FD)</option>
                    <option value="Certificates of Deposit (CDs)">Certificates of Deposit (CDs)</option>
                    <option value="Treasury Bills (T-Bills)">Treasury Bills (T-Bills)</option>
                    <option value="Debentures">Debentures</option>
                    <option value="Savings Bonds">Savings Bonds</option>
                    </optgroup>

                    {/* Real Estate Investments */}
                    <optgroup label="Real Estate Investments">
                    <option value="Residential Properties">Residential Properties</option>
                    <option value="Commercial Properties">Commercial Properties</option>
                    <option value="Real Estate Investment Trusts (REITs)">Real Estate Investment Trusts (REITs)</option>
                    <option value="Land Investments">Land Investments</option>
                    <option value="Vacation Properties">Vacation Properties</option>
                    <option value="Real Estate Crowdfunding">Real Estate Crowdfunding</option>
                    </optgroup>

                    {/* Alternative Investments */}
                    <optgroup label="Alternative Investments">
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Oil">Oil</option>
                    <option value="Agricultural Products">Agricultural Products</option>
                    <option value="Art">Art</option>
                    <option value="Antiques">Antiques</option>
                    <option value="Rare Coins">Rare Coins</option>
                    <option value="Stamps">Stamps</option>
                    <option value="Cryptocurrency">Cryptocurrency</option>
                    <option value="Hedge Funds">Hedge Funds</option>
                    <option value="Private Placements">Private Placements</option>
                    </optgroup>

                    {/* Insurance-Based Investments */}
                    <optgroup label="Insurance-Based Investments">
                    <option value="Life Insurance Policies">Life Insurance Policies</option>
                    <option value="Annuities">Annuities</option>
                    <option value="Unit Linked Insurance Plans (ULIPs)">Unit Linked Insurance Plans (ULIPs)</option>
                    </optgroup>

                    {/* Retirement Accounts */}
                    <optgroup label="Retirement Accounts">
                    <option value="Individual Retirement Accounts (IRAs)">Individual Retirement Accounts (IRAs)</option>
                    <option value="401(k) Plans">401(k) Plans</option>
                    <option value="Pension Funds">Pension Funds</option>
                    <option value="Superannuation">Superannuation</option>
                    </optgroup>

                    {/* Savings and Deposits */}
                    <optgroup label="Savings and Deposits">
                    <option value="Savings Accounts">Savings Accounts</option>
                    <option value="Money Market Accounts">Money Market Accounts</option>
                    <option value="Recurring Deposits (RD)">Recurring Deposits (RD)</option>
                    </optgroup>

                    {/* Hybrid Investments */}
                    <optgroup label="Hybrid Investments">
                    <option value="Balanced Funds">Balanced Funds</option>
                    <option value="Asset Allocation Funds">Asset Allocation Funds</option>
                    <option value="Target Date Funds">Target Date Funds</option>
                    </optgroup>

                    {/* Business Investments */}
                    <optgroup label="Business Investments">
                    <option value="Franchise Ownership">Franchise Ownership</option>
                    <option value="Small Business Ownership">Small Business Ownership</option>
                    <option value="Angel Investing">Angel Investing</option>
                    </optgroup>

                    {/* Global and Regional Investments */}
                    <optgroup label="Global and Regional Investments">
                    <option value="Foreign Exchange (Forex Trading)">Foreign Exchange (Forex Trading)</option>
                    <option value="Sovereign Wealth Funds">Sovereign Wealth Funds</option>
                    <option value="Emerging Market Funds">Emerging Market Funds</option>
                    </optgroup>

                    {/* Socially Responsible Investments */}
                    <optgroup label="Socially Responsible Investments">
                    <option value="Green Bonds">Green Bonds</option>
                    <option value="Environmental, Social, and Governance (ESG) Funds">ESG Funds</option>
                    <option value="Social Impact Funds">Social Impact Funds</option>
                    </optgroup>

                    {/* Specialized Investments */}
                    <optgroup label="Specialized Investments">
                    <option value="Peer-to-Peer Lending">Peer-to-Peer Lending</option>
                    <option value="Crowd Funding">Crowd Funding</option>
                    <option value="Structured Products">Structured Products</option>
                    <option value="Derivatives">Derivatives</option>
                    </optgroup>
                    <optgroup label="Education and Self-Investment">
                    <option value="Education Funds">Education Funds</option>
                    <option value="Skills Development Programs">Skills Development Programs</option>
                    <option value="Certifications and Training">Certifications and Training</option>
                    </optgroup>
                </select>
                </div>


                <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                    Category
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                >
                    <option value="" disabled>Select a Category</option>
                    {/* Equity Investments */}
                    <optgroup label="Equity Investments">
                    <option value="Technology Stocks">Technology Stocks</option>
                    <option value="Healthcare Stocks">Healthcare Stocks</option>
                    <option value="Energy Stocks">Energy Stocks</option>
                    <option value="Financial Stocks">Financial Stocks</option>
                    <option value="Consumer Goods Stocks">Consumer Goods Stocks</option>
                    <option value="Industrial Stocks">Industrial Stocks</option>
                    <option value="Small-Cap Stocks">Small-Cap Stocks</option>
                    <option value="Mid-Cap Stocks">Mid-Cap Stocks</option>
                    <option value="Large-Cap Stocks">Large-Cap Stocks</option>
                    <option value="Growth Stocks">Growth Stocks</option>
                    <option value="Value Stocks">Value Stocks</option>
                    <option value="Dividend Stocks">Dividend Stocks</option>
                    <option value="Blue-Chip Stocks">Blue-Chip Stocks</option>
                    <option value="Sector-Specific ETFs">Sector-Specific ETFs</option>
                    <option value="Thematic Funds">Thematic Funds</option>
                    </optgroup>

                    {/* Fixed-Income Investments */}
                    <optgroup label="Fixed-Income Investments">
                    <option value="Government Bonds">Government Bonds</option>
                    <option value="Corporate Bonds">Corporate Bonds</option>
                    <option value="High-Yield Bonds">High-Yield Bonds</option>
                    <option value="Municipal Bonds">Municipal Bonds</option>
                    <option value="Short-Term Fixed Deposits">Short-Term Fixed Deposits</option>
                    <option value="Long-Term Fixed Deposits">Long-Term Fixed Deposits</option>
                    <option value="Inflation-Protected Securities">Inflation-Protected Securities</option>
                    <option value="Floating Rate Bonds">Floating Rate Bonds</option>
                    <option value="Tax-Free Bonds">Tax-Free Bonds</option>
                    <option value="Investment-Grade Bonds">Investment-Grade Bonds</option>
                    </optgroup>

                    {/* Real Estate Investments */}
                    <optgroup label="Real Estate Investments">
                    <option value="Residential Properties">Residential Properties</option>
                    <option value="Commercial Properties">Commercial Properties</option>
                    <option value="Industrial Properties">Industrial Properties</option>
                    <option value="Vacation or Holiday Homes">Vacation or Holiday Homes</option>
                    <option value="Land Development Projects">Land Development Projects</option>
                    <option value="Urban Real Estate">Urban Real Estate</option>
                    <option value="Suburban Real Estate">Suburban Real Estate</option>
                    <option value="Real Estate Crowdfunding">Real Estate Crowdfunding</option>
                    <option value="Real Estate Investment Trusts">Real Estate Investment Trusts</option>
                    </optgroup>

                    {/* Add more categories here */}
                </select>
                </div>


                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    name="purchase_date"
                    value={formData.purchase_date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Initial Amount
                  </label>
                  <input
                    type="number"
                    name="initial_amount"
                    value={formData.initial_amount}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => togglePopup()}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {formData.id ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {isDeletePopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this investment?</h2>
              <div className="flex justify-between">
                <button
                  onClick={() => toggleDeletePopup(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Investment;

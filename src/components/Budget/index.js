import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header";
import Sidebar from "../Sidebar";

function Budget() {
  const [data, setData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [category, setcategory] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    amount: "",
    start_date: "",
    end_date: "",
    category:"",
    description:""
  });
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); 
  const [deleteBudgetId, setDeleteBudgetId] = useState(null); 
  const token = Cookies.get("auth_token"); 

  const fetchcategory = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/category/get_all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.data) {
        setcategory(response.data.data); // Store category
      } else {
        setMessage("No category found.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error fetching category:", error.response.data.error);
      setMessage(error.response.data.error || "An error occurred while fetching category data.");
      setMessageType("error");
    }
  };

  // Fetch budget data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/budget/get_all", {
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
      setMessage(error.response.data.error || "An error occurred while fetching budget data.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open popup for add or update budget
  const togglePopup = (budget = null) => {
    if (budget) {
      setFormData({
        id: budget.id,
        amount: budget.amount,
        start_date: budget.start_date,
        end_date: budget.end_date,
        description:budget.description,
        category:budget.category
      });
    } else {
      setFormData({
        id: null,
        amount: "",
        start_date: "",
        end_date: "",
        description:"",
        category:""
      });
    }
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle submit form for add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (formData.id) {
        // Update budget API call
        response = await axios.put(`http://localhost:8000/api/v1/budget/update/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(response.data.message || "Updated successfully!");
        setMessageType("success");

        // Update state directly to reflect changes (this helps with single record update)
        setData(prevData => prevData.map(item => (item.id === formData.id ? { ...item, ...formData } : item)));
      } else {
        // Add budget API call
        response = await axios.post("http://localhost:8000/api/v1/budget/create", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage(response.data.message || "Created successfully!");
        setMessageType("success");

        // Add new budget to state
        setData([...data, response.data]);
        fetchData();
      }
      togglePopup();
    } catch (error) {
      setMessage(error.response.data.error || "An error occurred while processing the request.");
      setMessageType("error");
    }
  };

  // Open delete confirmation popup
  const toggleDeletePopup = (budgetId) => {
    setDeleteBudgetId(budgetId);
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  // Delete budget
  const handleDelete = async () => {
    if (!deleteBudgetId) return;
    
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/budget/delete/${deleteBudgetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || "Deleted successfully!");
      setMessageType("success");

      // Remove deleted budget from state
      setData(prevData => prevData.filter(item => item.id !== deleteBudgetId));
      setIsDeletePopupOpen(false); 
    } catch (error) {
      setMessage(error.response.data.error || "An error occurred while deleting the budget.");
      setMessageType("error");
      setIsDeletePopupOpen(false); 
    }
  };

  useEffect(() => {
    fetchData();
    fetchcategory();
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
            Add Budget
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
                  <th className="px-4 py-2">S.No.</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Start Date</th>
                  <th className="px-4 py-2">End Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
              {data.map((budget, index) => {
                const categoryName = category.find(cat => cat.id === budget.category)?.name || 'N/A';
                return (
                <tr key={budget.id} className="border-t">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{categoryName}</td>
                  <td className="border px-4 py-2">{budget.amount}</td>
                  <td className="border px-4 py-2">{budget.description}</td>
                  <td className="border px-4 py-2">{budget.start_date}</td>
                  <td className="border px-4 py-2">{budget.end_date}</td>
                  <td className="border px-4 py-2 space-x-2">
                      <div className="flex space-x-2">
                        {/* Update Icon */}
                        <span
                          onClick={() => togglePopup(budget)}
                          className="text-blue-500 cursor-pointer hover:text-yellow-600 mx-2"
                        >
                          <FiEdit  />
                        </span>

                        {/* Delete Icon */}
                        <span
                          onClick={() => toggleDeletePopup(budget.id)}
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
      </div>

      {/* Popup for Add/Edit Budget */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {formData.id ? "Edit Budget" : "Add Budget"}
            </h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {category.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {formData.id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-gray-500">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md ">
          <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this budget?</h3>
            <div className="flex justify-between space-x-4 mt-4">
              <button
                onClick={() => toggleDeletePopup(null)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budget;

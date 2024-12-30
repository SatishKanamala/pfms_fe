import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header";
import Sidebar from "../Sidebar";

function Transaction() {
  const [data, setData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [formData, setFormData] = useState({
    id: null,
    account_id: "",
    transaction_type: "",
    amount: "",
    date: "",
  });
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); 
  const [deleteTransactionId, setDeleteTransactionId] = useState(null); 
  const token = Cookies.get("auth_token"); 

  // Fetch transaction data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/transaction/get_all", {
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
      setMessage(error.response.data.error || "An error occurred while fetching transaction data.");
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

  // Open popup for add or update transaction
  const togglePopup = (transaction = null) => {
    if (transaction) {
      setFormData({
        id: transaction.id,
        account_id: transaction.account_id,
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        date: transaction.date,
      });
    } else {
      setFormData({
        id: null,
        account_id: "",
        transaction_type: "",
        amount: "",
        date: "",
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
        // Update transaction API call
        response = await axios.put(`http://localhost:8000/api/v1/transaction/update/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(response.data.message || "Updated successfully!");
        setMessageType("success");

        // Update state directly to reflect changes (this helps with single record update)
        setData(prevData => prevData.map(item => (item.id === formData.id ? { ...item, ...formData } : item)));
      } else {
        // Add transaction API call
        response = await axios.post("http://localhost:8000/api/v1/transaction/create", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage(response.data.message || "Created successfully!");
        setMessageType("success");

        // Add new transaction to state
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
  const toggleDeletePopup = (transactionId) => {
    setDeleteTransactionId(transactionId);
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  // Delete transaction
  const handleDelete = async () => {
    if (!deleteTransactionId) return;
    
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/transaction/delete/${deleteTransactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || "Deleted successfully!");
      setMessageType("success");

      // Remove deleted transaction from state
      setData(prevData => prevData.filter(item => item.id !== deleteTransactionId));
      setIsDeletePopupOpen(false); 
    } catch (error) {
      setMessage(error.response.data.error || "An error occurred while deleting the transaction.");
      setMessageType("error");
      setIsDeletePopupOpen(false); 
    }
  };

  useEffect(() => {
    fetchData();
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

        {/* Show message at the top */}
        {message && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-xl p-4 mb-4 text-white rounded-lg flex items-center ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}
            style={{ maxWidth: '400px', wordWrap: 'break-word' }} // Dynamically adjust width and wrap text
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
            Add Transaction
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
                  <th className="px-4 py-2">Account ID</th>
                  <th className="px-4 py-2">Transaction Type</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.account_id}</td>
                    <td className="border px-4 py-2">{item.transaction_type}</td>
                    <td className="border px-4 py-2">{item.amount}</td>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <div className="flex space-x-2">
                        {/* Update Icon */}
                        <span
                          onClick={() => togglePopup(item)}
                          className="text-yellow-500 cursor-pointer hover:text-yellow-700"
                        >
                          <FiEdit />
                        </span>
                        {/* Delete Icon */}
                        <span
                          onClick={() => toggleDeletePopup(item.id)}
                          className="text-red-500 cursor-pointer hover:text-red-700"
                        >
                          <FiTrash2 />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Confirmation Popup */}
        {isDeletePopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-lg font-semibold">Are you sure you want to delete this transaction?</h3>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setIsDeletePopupOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Update Transaction Form */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-lg font-semibold">{formData.id ? "Update Transaction" : "Add Transaction"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mt-4">
                  <label className="block text-gray-700">Account ID</label>
                  <input
                    type="text"
                    name="account_id"
                    value={formData.account_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Transaction Type</label>
                  <select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Deposit">Deposit</option>
                    <option value="Withdrawal">Withdrawal</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transaction;

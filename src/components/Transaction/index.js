import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header";
import Sidebar from "../Sidebar";

function Transaction() {
  const [data, setData] = useState([]); 
  const [account, setaccount] = useState([]); // To store account data
  const [category, setcategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [formData, setFormData] = useState({
    id: null,
    account: "",
    transaction_type: "",
    amount: "",
    category:"",
    description:""
  });
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); 
  const [deleteTransactionId, setDeleteTransactionId] = useState(null); 
  const token = Cookies.get("auth_token"); 

  // Fetch category data from API
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

  // Fetch account data from API
  const fetchaccount = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/account/get_all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.data) {
        setaccount(response.data.data); // Store account
      } else {
        setMessage("No account found.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error fetching account:", error.response.data.error);
      setMessage(error.response.data.error || "An error occurred while fetching account data.");
      setMessageType("error");
    }
  };

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
        account: transaction.account,
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category
      });
    } else {
      setFormData({
        id: null,
        account: "",
        transaction_type: "",
        amount: "",
        category: "",
        description: ""
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
    fetchaccount(); // Fetch account when component mounts
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
                  <th className="px-4 py-2">Account Name</th>
                  <th className="px-4 py-2">Transaction Type</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
              {data.map((transaction, index) => {
                // Find the account name by matching the account ID
                const accountName = account.find(acc => acc.id === transaction.account)?.bank_name || 'N/A';
                
                // Find the category name by matching the category ID
                const categoryName = category.find(cat => cat.id === transaction.category)?.name || 'N/A';
                
                return (
                  <tr key={transaction.id} className="border-t">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{accountName}</td>  {/* Display account name */}
                    
                    <td className="border px-4 py-2">{transaction.transaction_type}</td>
                    <td className="border px-4 py-2">{transaction.amount}</td>
                    <td className="border px-4 py-2">{categoryName}</td>  {/* Display category name */}
                    <td className="border px-4 py-2">{transaction.description}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <div className="flex space-x-2">
                        {/* Update Icon */}
                        <span
                          onClick={() => togglePopup(transaction)}
                                              className="text-blue-500 cursor-pointer hover:text-yellow-600 mx-2"
                                            >
                                              <FiEdit  />
                                            </span>
                    
                                            {/* Delete Icon */}
                                            <span
                                              onClick={() => toggleDeletePopup(transaction.id)}
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

        {/* Add/Update Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {formData.id ? "Update Transaction" : "Add Transaction"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="account" className="block text-sm font-medium text-gray-700">Account</label>
                  <select
                    id="account"
                    name="account"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.account}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Account</option>
                    {account.map((acc) => (
                      <option key={acc.id} value={acc.id}>{acc.bank_name}-{acc.account_number}</option>
                    ))}
                  </select>
                </div>
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
                  <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700">Transaction Type</label>
                  <select
                    id="transaction_type"
                    name="transaction_type"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.transaction_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Income">Income</option>
                    <option value="Expenses">Expenses</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
                    onClick={() => togglePopup()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 px-6 py-2 text-white rounded-md"
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
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 bg-gray-500">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this transaction?</h2>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
                  onClick={() => setIsDeletePopupOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-red-600 px-6 py-2 text-white rounded-md"
                  onClick={handleDelete}
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

export default Transaction;

import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle} from 'react-icons/fi'; 
import { ThreeDots } from 'react-loader-spinner';
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header";
import Sidebar from "../Sidebar";

function Account() {
  const [data, setData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [formData, setFormData] = useState({
    id: null,
    bank_name: "",
    account_number: "",
    account_type: "",
    current_balance: "",
  });
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); 
  const [deleteAccountId, setDeleteAccountId] = useState(null); 
  const token = Cookies.get("auth_token"); 

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/account/get_all", {
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
      setMessage(error.response.data.error || "An error occurred while fetching account data.");
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

  // Open popup for add or update
  const togglePopup = (account = null) => {
    if (account) {
      setFormData({
        id: account.id,
        bank_name: account.bank_name,
        account_number: account.account_number,
        account_type: account.account_type,
        current_balance: account.current_balance,
      });
    } else {
      setFormData({
        id: null,
        bank_name: "",
        account_number: "",
        account_type: "",
        current_balance: "",
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
        // Update API call
        const response = await axios.put(`http://localhost:8000/api/v1/account/update/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(response.data.message || "Updated successfully!");
        setMessageType("success");

        // Update state directly to reflect changes (this helps with single record update)
        setData(prevData => prevData.map(item => (item.id === formData.id ? { ...item, ...formData } : item)));
      } else {
        // Add API call
        response = await axios.post("http://localhost:8000/api/v1/account/create", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setMessage(response.data.message || "Created successfully!");
        setMessageType("success");

        // Add new account to state
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
  const toggleDeletePopup = (accountId) => {
    setDeleteAccountId(accountId);
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  // Delete account
  const handleDelete = async () => {
    if (!deleteAccountId) return;
    
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/account/delete/${deleteAccountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || "Deleted successfully!");
      setMessageType("success");

      // Remove deleted account from state
      setData(prevData => prevData.filter(item => item.id !== deleteAccountId));
      setIsDeletePopupOpen(false); 
    } catch (error) {
      setMessage(error.response.data.error || "An error occurred while deleting the account.");
      setMessageType("error");
      setIsDeletePopupOpen(false); 
    }
  };

  // Fetch single account details
  const fetchSingleAccount = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/account/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(response.data.data); 
      togglePopup(response.data.data); 
    } catch (error) {
      console.error("Error fetching single account details:", error);
      setMessage(error.response.data.error || "An error occurred while fetching account details.");
      setMessageType("error");
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
        <br/><br/><br/><br/><br/>
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
            Add Account
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
                  <th className="px-4 py-2">Bank Name</th>
                  <th className="px-4 py-2">Account Number</th>
                  <th className="px-4 py-2">Account Type</th>
                  <th className="px-4 py-2">Current Balance</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td 
                      className="border px-4 py-2 text-blue-500 cursor-pointer" 
                      onClick={() => fetchSingleAccount(item.id)}
                    >
                      {item.bank_name}
                    </td>
                    <td className="border px-4 py-2">{item.account_number}</td>
                    <td className="border px-4 py-2">{item.account_type}</td>
                    <td className="border px-4 py-2">{item.current_balance}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <div className="flex space-x-2">
                        {/* Update Icon */}
                        <span
                          onClick={() => togglePopup(item)}
                          className="text-blue-500 cursor-pointer hover:text-yellow-600 mx-2"
                        >
                          <FiEdit  />
                        </span>

                        {/* Delete Icon */}
                        <span
                          onClick={() => toggleDeletePopup(item.id)}
                          className="text-red-500 cursor-pointer hover:text-red-600 mx-2"
                        >
                          <FiTrash2  />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add or Update Account Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                {formData.id ? "Update Account" : "Add Account"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Account Type</label>
                  <input
                    type="text"
                    name="account_type"
                    value={formData.account_type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Current Balance</label>
                  <input
                    type="number"
                    name="current_balance"
                    value={formData.current_balance}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {formData.id ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Popup */}
        {isDeletePopupOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this account?</h2>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsDeletePopupOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default Account;

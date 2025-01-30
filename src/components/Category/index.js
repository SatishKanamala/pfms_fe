import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header";
import Sidebar from "../Sidebar";




function Category() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    is_income_generating: false, // Add is_income_generating field
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const token = Cookies.get("auth_token");

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/category/get_all", {
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

  // Handle is_income_generating change
  const handleIncomeGeneratingChange = (e) => {
    setFormData({ ...formData, is_income_generating: e.target.value === "yes" });
  };

  // Open popup for add or update
  const togglePopup = (category = null) => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description,
        is_income_generating: category.is_income_generating, // Load current value
      });
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        is_income_generating: false, // Default value
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
        const response = await axios.put(`http://localhost:8000/api/v1/category/update/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(response.data.message || "Updated successfully!");
        setMessageType("success");

        // Update state directly to reflect changes (this helps with single record update)
        setData(prevData => prevData.map(item => (item.id === formData.id ? { ...item, ...formData } : item)));
      } else {
        // Add API call
        response = await axios.post("http://localhost:8000/api/v1/category/create", formData, {
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
  const toggleDeletePopup = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  // Delete account
  const handleDelete = async () => {
    if (!deleteCategoryId) return;
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/category/delete/${deleteCategoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || "Deleted successfully!");
      setMessageType("success");

      // Remove deleted account from state
      setData(prevData => prevData.filter(item => item.id !== deleteCategoryId));
      setIsDeletePopupOpen(false);
    } catch (error) {
      setMessage(error.response.data.error || "An error occurred while deleting the account.");
      setMessageType("error");
      setIsDeletePopupOpen(false);
    }
  };

  // Fetch single account details
  const fetchSingleCategory = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/category/get/${id}`, {
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
            Add Category
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
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Income Generating</th> {/* Add a new column */}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td
                      className="border px-4 py-2 text-blue-500 cursor-pointer"
                      onClick={() => fetchSingleCategory(item.id)}
                    >
                      {item.name}
                    </td>
                    <td className="border px-4 py-2">{item.description}</td>
                    <td className="border px-4 py-2">
                      {item.is_income_generating ? "Yes" : "No"}
                    </td> {/* Show Income Generating */}
                    <td className="border px-4 py-2 space-x-2">
                      <div className="flex space-x-2">
                        {/* Update Icon */}
                        <span
                          onClick={() => togglePopup(item)}
                          className="hover:text-blue-600 text-blue-500 cursor-pointer mx-2"
                        >
                          <FiEdit  />
                        </span>

                        {/* Delete Icon */}
                        <span
                          onClick={() => toggleDeletePopup(item.id)}
                          className="text-red-500 cursor-pointer hover:text-red-600"
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
      </div>

      {/* Add or Update Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{formData.id ? "Update Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700">Transaction Category</label>
                <select
                  name="transactionCategory"
                  value={formData.transactionCategory}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select a category</option>
                  
                  {/* Income Categories */}
                  <optgroup label="Income Categories">
                    <option value="salary">Salary</option>
                    <option value="bonus">Bonus</option>
                    <option value="interest-income">Interest Income</option>
                    <option value="dividend-income">Dividend Income</option>
                    <option value="rental-income">Rental Income</option>
                    <option value="business-revenue">Business Revenue</option>
                    <option value="freelance">Freelance/Contract Work</option>
                    <option value="royalties">Royalties</option>
                    <option value="tax-refunds">Tax Refunds</option>
                    <option value="gifts-received">Gifts Received</option>
                    <option value="grants-subsidies">Grants/Subsidies</option>
                  </optgroup>

                  {/* Expense Categories */}
                  <optgroup label="Expense Categories">
                    {/* Personal Expenses */}
                    <option value="groceries">Groceries</option>
                    <option value="rent">Rent/Mortgage</option>
                    <option value="utilities">Utilities</option>
                    <option value="transportation">Transportation</option>
                    <option value="insurance">Insurance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="dining">Dining/Restaurants</option>
                    <option value="clothing">Clothing/Apparel</option>
                    <option value="personal-care">Personal Care</option>
                    <option value="fitness">Fitness</option>
                    <option value="travel">Travel</option>

                    {/* Business Expenses */}
                    <option value="office-supplies">Office Supplies</option>
                    <option value="marketing">Marketing/Advertising</option>
                    <option value="employee-salaries">Employee Salaries</option>
                    <option value="training">Training/Workshops</option>
                    <option value="software">Software/Subscriptions</option>
                    <option value="professional-services">Professional Services</option>
                    <option value="business-travel">Business Travel</option>
                    <option value="equipment">Equipment</option>

                    {/* Miscellaneous Expenses */}
                    <option value="charity">Charity/Donations</option>
                    <option value="gifts-given">Gifts Given</option>
                    <option value="taxes">Taxes Paid</option>
                    <option value="penalties">Penalties/Fines</option>
                  </optgroup>

                  {/* Savings/Investment Categories */}
                  <optgroup label="Savings/Investment Categories">
                    <option value="savings-deposit">Savings Deposit</option>
                    <option value="stock-purchase">Stock Purchase</option>
                    <option value="mutual-funds">Mutual Funds</option>
                    <option value="real-estate">Real Estate Investment</option>
                    <option value="retirement-contributions">Retirement Contributions</option>
                    <option value="fixed-deposits">Fixed Deposits</option>
                    <option value="bonds">Bonds</option>
                    <option value="cryptocurrency">Cryptocurrency</option>
                  </optgroup>

                  {/* Loan Categories */}
                  <optgroup label="Loan Categories">
                    <option value="personal-loan">Personal Loan</option>
                    <option value="auto-loan">Auto Loan</option>
                    <option value="mortgage">Mortgage</option>
                    <option value="student-loan">Student Loan</option>
                    <option value="business-loan">Business Loan</option>
                  </optgroup>

                  {/* Tax Categories */}
                  <optgroup label="Tax Categories">
                    <option value="income-tax">Income Tax</option>
                    <option value="property-tax">Property Tax</option>
                    <option value="sales-tax">Sales Tax</option>
                    <option value="gst">GST/VAT</option>
                  </optgroup>

                  {/* E-commerce/Online Payment Categories */}
                  <optgroup label="E-commerce/Online Payment">
                    <option value="online-shopping">Online Shopping</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="digital-goods">Digital Goods</option>
                  </optgroup>

                  {/* Financial Transfers */}
                  <optgroup label="Financial Transfers">
                    <option value="bank-transfers">Bank Transfers</option>
                    <option value="mobile-wallets">Mobile Wallet Transfers</option>
                    <option value="credit-card">Credit Card Payments</option>
                    <option value="debit-card">Debit Card Payments</option>
                    <option value="atm-withdrawals">ATM Withdrawals</option>
                  </optgroup>

                  {/* Special Categories */}
                  <optgroup label="Special Categories">
                    <option value="emergency-fund">Emergency Fund</option>
                    <option value="childcare">Childcare</option>
                    <option value="wedding">Wedding/Events</option>
                    <option value="home-renovation">Home Renovation</option>
                  </optgroup>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Add the Income Generating Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700">Income Generating</label>
                <select
                  name="is_income_generating"
                  value={formData.is_income_generating ? "yes" : "no"}
                  onChange={handleIncomeGeneratingChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="flex justify-between mt-4">
                
                <button
                  type="button"
                  onClick={() => togglePopup()}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
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
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this category?</h2>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
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

export default Category;

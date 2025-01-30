import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header";
import Sidebar from "../Sidebar";

function Goal() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    goal_name: "",
    target_amount: "",
    current_savings:"",
    start_date: "",
    end_date:"",
    priority:"",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteGoalId, setDeleteGoalId] = useState(null);
  const token = Cookies.get("auth_token");

  // Fetch goal data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/goal/get_all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.data) {
        setData(response.data.data);
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

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open popup for add or update goal
  const togglePopup = (goal = null) => {
    if (goal) {
      setFormData({
        id: goal.id,
        goal_name: goal.goal_name,
        target_amount: goal.target_amount,
        start_date: goal.start_date,
        end_date:goal.end_date,
        current_savings: goal.current_savings,
        priority: goal.priority,
      });
    } else {
      setFormData({
        id: null,
        goal_name: "",
        target_amount: "",
        start_date: "",
        end_date:"",
        current_savings: "",
        priority: "",
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
        // Update goal API call
        response = await axios.put(
          `http://localhost:8000/api/v1/goal/update/${formData.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage(response.data.message || "Updated successfully!");
        setMessageType("success");

        // Update state directly to reflect changes (this helps with single record update)
        setData((prevData) =>
          prevData.map((item) => (item.id === formData.id ? { ...item, ...formData } : item))
        );
      } else {
        // Add goal API call
        response = await axios.post("http://localhost:8000/api/v1/goal/create", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage(response.data.message || "Created successfully!");
        setMessageType("success");

        // Add new goal to state
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
  const toggleDeletePopup = (goalId) => {
    setDeleteGoalId(goalId);
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  // Delete goal
  const handleDelete = async () => {
    if (!deleteGoalId) return;

    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/goal/delete/${deleteGoalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || "Deleted successfully!");
      setMessageType("success");

      // Remove deleted goal from state
      setData((prevData) => prevData.filter((item) => item.id !== deleteGoalId));
      setIsDeletePopupOpen(false);
    } catch (error) {
      setMessage(error.response.data.error || "An error occurred while deleting the goal.");
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
        <br/><br/><br/><br/><br/>
        {/* Show message at the top */}
        {message && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-xl p-4 mb-4 text-white rounded-lg flex items-center ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}
            style={{ maxWidth: "400px", wordWrap: "break-word" }}
          >
            <div className="mr-3">
              {messageType === "success" ? <FiCheckCircle size={24} /> : <FiXCircle size={24} />}
            </div>
            <div className="flex-grow">{message}</div>
          </div>
        )}

        <div className="mt-6 mr-6 flex justify-end">
          <button
            onClick={() => togglePopup()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Add Goal
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6 relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <ThreeDots height="20" width="20" color="blue" ariaLabel="tail-spin-loading" radius="3" wrapperClass="flex justify-center items-center" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center">
              <div>
                <img src="images/no_data.png" alt="No Data" className="max-w-xs w-full mx-auto" />
              </div>
            </div>
          ) : (
            <table className="table-auto w-full bg-white rounded-lg shadow-md border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">S.No.</th>
                  <th className="px-4 py-2">Goal Name</th>
                  <th className="px-4 py-2">Start Date</th>
                  <th className="px-4 py-2">End Date</th>
                  <th className="px-4 py-2">Target Amount</th>
                  <th className="px-4 py-2">Current Savings</th>
                  <th className="px-4 py-2">Progress</th>
                  <th className="px-4 py-2">Priority</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((goal, index) => {
                  return (
                    <tr key={goal.id} className="border-t">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{goal.goal_name}</td>
                      <td className="border px-4 py-2">{goal.start_date}</td>
                      <td className="border px-4 py-2">{goal.end_date}</td>
                      <td className="border px-4 py-2">{goal.target_amount}</td>
                      <td className="border px-4 py-2">{goal.current_savings}</td>
                      <td className="border px-4 py-2">{goal.progress}</td>
                      <td className="border px-4 py-2">{goal.priority}</td>
                      <td className="border px-4 py-2 space-x-2">
                      <div className="flex space-x-2">
                        {/* Update Icon */}
                        <span
                          onClick={() => togglePopup(goal)}
                          className="text-blue-500 cursor-pointer hover:text-yellow-600 mx-2"
                        >
                          <FiEdit  />
                        </span>

                        {/* Delete Icon */}
                        <span
                          onClick={() => toggleDeletePopup(goal.id)}
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

        {/* Goal Form Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl mb-4">{formData.id ? "Edit Goal" : "Add Goal"}</h2>
              <form onSubmit={handleSubmit}>

                <div className="mb-4">
                  <label htmlFor="goalname" className="block text-sm font-semibold mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    id="goalname"
                    name="goal_name"
                    value={formData.goal_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="start_date" className="block text-sm font-semibold mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="end_date" className="block text-sm font-semibold mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="target_amount" className="block text-sm font-semibold mb-2">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    id="target_amount"
                    name="target_amount"
                    value={formData.target_amount}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="current_savings" className="block text-sm font-semibold mb-2">
                    Current Savings
                  </label>
                  <input
                    type="number"
                    id="current_savings"
                    name="current_savings"
                    value={formData.current_savings}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />
                </div>

                {/* <div className="mb-4">
                  <label htmlFor="progress" className="block text-sm font-semibold mb-2">
                    Progress
                  </label>
                  <textarea
                    id="number"
                    name="progress"
                    value={formData.progress}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                </div> */}

                <div className="mb-4">
                  <label htmlFor="priority" className="block text-sm font-semibold mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={() => setIsPopupOpen(false)} className="bg-gray-400 text-white hover:bg-gray-500 px-4 py-2 rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    {formData.id ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {isDeletePopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg mb-4">Are you sure you want to delete this goal?</h2>
              <div className="flex justify-between">
                <button onClick={() => setIsDeletePopupOpen(false)} className="bg-gray-300 px-4 py-2 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg">
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

export default Goal;

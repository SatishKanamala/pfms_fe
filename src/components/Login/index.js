import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies

import "./index.css";

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [errors, setErrors] = useState([]); // Initialize as an array

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); // Clear previous errors

    try {
      const { usernameOrEmail, password } = formData;

      // Determine if the input is an email or username
      let payload = {};

      // Check if the input is an email or username
      if (usernameOrEmail.includes("@")) {
        payload = { email: usernameOrEmail, password }; // Send as email if contains "@"
      } else {
        payload = { username: usernameOrEmail, password }; // Send as username if no "@" symbol
      }

      const response = await axios.post("http://localhost:8000/api/v1/user/login", payload);
      console.log(response.data);

      if (response.data.data.token) {
        // Save token to cookies
        Cookies.set("auth_token", response.data.token, { expires: 7 }); // Token will expire in 7 days
        setMessage("Login successful!");
        setMessageType("success");
        setErrors([]);

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        const backendErrors = Array.isArray(error.response.data.error)
          ? error.response.data.error
          : [{ error: error.response.data.error }];
        setErrors(backendErrors);
        setMessageType("error");
      } else {
        setErrors([{ error: "Unable to connect to the server." }]);
        setMessageType("error");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 xl:w-1/2 bg-indigo-100 flex justify-center items-center p-6">
        <img
          src="https://via.placeholder.com/300"
          alt="illustration"
          className="max-w-xs w-full"
        />
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/2 w-full flex justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-indigo-600">Welcome Back</h1>
            <p className="text-gray-600">Login to your account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email or Username</label>
              <input
                type="text"
                name="usernameOrEmail"
                placeholder="Enter your email or username"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Login
            </button>
          </form>

          {/* Display success message */}
          {message && messageType === "success" && (
            <div className={`mt-4 text-center text-green-500`}>{message}</div>
          )}

          {/* Display errors */}
          {errors.length > 0 && (
            <div className={`mt-4 text-center text-red-500`}>
              <ul>
                {errors.map((err, index) => (
                  <li key={index}>{err.error}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/" className="text-indigo-600 hover:text-indigo-800">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

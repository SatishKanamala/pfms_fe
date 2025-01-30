import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Frontend validation for password confirmation
    if (formData.password !== formData.confirmPassword) {
      setErrors([{ error: "Passwords do not match!" }]);
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setMessage(`Success: ${response.data.message}`);
      setMessageType("success");
      setErrors([]);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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

  const handleGoogleSuccess = async (response) => {
    try {
      const googleData = response.credential; // Token from Google
      const res = await axios.post("http://localhost:8000/api/v1/user/login/google", {
        token: googleData,
      });
      
      if (res.data.data.token) {
              console.log(res.data.data.token);
              
              // Save token to cookies
              Cookies.set("auth_token", res.data.data.token, { expires: 7 }); // Token will expire in 7 days
              setMessage("successs");
              setMessageType("success");
              setErrors([]);
      
              // Redirect to home page after 2 seconds
              setTimeout(() => {
                navigate("/home");
              }, 2000);
            }    
    } catch (error) {
      console.log(error.res.data.error);
      if (error.res && error.res.data.error) {
        const backendErrors = Array.isArray(error.res.data.error)
          ? error.res.data.error
          : [{ error: error.res.data.error }];
        setErrors(backendErrors);
        setMessageType("error");
      } else {
        setErrors([{ error: "Unable to connect to the server." }]);
        setMessageType("error");
      }
    }
  };

  const handleGoogleError = () => {
    setErrors([{ error: "Google authentication failed. Please try again." }]);
    setMessageType("error");
  };

  return (
    <GoogleOAuthProvider 
    clientId="985346293558-iaff7dse11icdvs4v2e1n241tcmlglbq.apps.googleusercontent.com"
    >
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 xl:w-1/2 bg-indigo-100 flex flex-col justify-center items-center p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-10 text-center">
            Welcome to Personal Finance Management Services!
          </h1>

          <img
            src="/images/Wallet.png"
            alt="Wallet"
            className="max-w-xs w-full"
          />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 xl:w-1/2 bg-white shadow-lg p-6 flex flex-col justify-center items-center">
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Already have an account? <a href="/login" className="text-indigo-600">Sign In</a>
          </p>
          <h5 className="text-lg sm:text-xl font-semibold mb-4">Register your account</h5>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm text-gray-600">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="8+ characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm text-gray-600">Re-enter Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </form>

          {/* Display success message */}
          {message && messageType === "success" && (
            <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md">{message}</div>
          )}

          {/* Display errors */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
              <ul>
                {errors.map((err, index) => (
                  <li key={index}>{err.error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Social login section */}
          <div className="mt-3 text-center">
            <p className="text-xs sm:text-sm text-gray-600">OR</p>
            <div className="flex justify-center space-x-4 mt-2">
              <GoogleLogin clientId = "985346293558-iaff7dse11icdvs4v2e1n241tcmlglbq.apps.googleusercontent.com"
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signup_with"
                shape="rectangular"
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;

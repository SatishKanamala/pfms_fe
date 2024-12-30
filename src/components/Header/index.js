import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Header = () => {
  const [userData, setUserData] = useState({ username: "", greeting: "" });

  useEffect(() => {
    const token = Cookies.get("auth_token"); // Retrieve the token from cookies

    if (token) {
      axios
        .get("http://localhost:8000/api/v1/user/user-info", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          withCredentials: true, // Ensure cookies are sent with the request
        })
        .then((response) => {
          setUserData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.error("No token found in cookies");
    }
  }, []);

  return (
    <header className="flex justify-between items-center p-6 bg-white shadow-md">
      <div>
        <h1 className="text-2xl font-semibold text-indigo-600">
          {userData.greeting}, {userData.username}
        </h1>
        <p className="text-gray-600">Celebrate small wins—every financial milestone is a step closer to your dreams.</p>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="rounded-full border-2 border-indigo-600"
        />
      </div>
    </header>
  );
};

export default Header;

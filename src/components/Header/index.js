import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Header = () => {
  const [userData, setUserData] = useState({ username: "", greeting: "", profile_pic:""  });

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
    <header className="flex p-6 bg-white shadow-md w-full fixed">
      <div>
        <h1 className="text-2xl font-semibold text-indigo-600 ">
          {userData.greeting}, <span className="font-bold">{userData.username.toUpperCase()}</span>
        </h1>
        <p className="text-gray-600">Celebrate small wins—every financial milestone is a step closer to your dreams.</p>
      </div>

      <div className="flex mx-36">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <img
          src={`${userData.profile_pic}`}
          alt="Profile"
          className="rounded-full w-12 h-12 ml-4"
        />
      </div>
    </header>
  );
};

export default Header;

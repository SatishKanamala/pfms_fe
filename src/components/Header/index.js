import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-white shadow-md">
      <div>
        <h1 className="text-2xl font-semibold text-indigo-600">Good Morning, Gabby</h1>
        <p className="text-gray-600">Long time no see</p>
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

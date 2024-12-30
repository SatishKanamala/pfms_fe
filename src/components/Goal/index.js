import React from "react";

import Header from "../Header";
import Sidebar from "../Sidebar";

function Goal() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="mt-6 mr-6 flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
                Add
              </button>
        </div>
        <div className="flex items-center justify-center flex-1 p-6">
          {/* Content Wrapper */}
          
          <div className="text-center">
            <div>
              <img
                src="images/no_data.png"
                alt="No Data"
                className="max-w-xs w-full mx-auto"
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goal;

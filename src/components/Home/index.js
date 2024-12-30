import React ,{useEffect,useContext,useState} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Header from "../Header";
import Overview from "../Overview";
// import Transactions from "../Transactions";
// import Analytics from "../Analytics";
// import StockPortfolio from "../StockPortfolio";
import Sidebar from "../Sidebar";

function Home() {
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 space-y-6">
          {/* Overview Component */}
          <Overview />

          {/* Grid for large screens, stacked for small screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* <Transactions /> */}
            {/* <Analytics /> */}
          </div>

          {/* Optional: Stock Portfolio (only on larger screens) */}
          {/* <StockPortfolio /> */}
        </div>
      </div>
    </div>
  );
}

export default Home;

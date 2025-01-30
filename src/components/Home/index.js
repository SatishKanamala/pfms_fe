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
        <div>
        <Header />
        </div>
        <br/><br/><br/><br/><br/>
        <div className="p-6 space-y-6">
          {/* Overview Component */}
          <Overview />

          
        </div>
      </div>
    </div>
  );
}

export default Home;

import React from "react";

const Overview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-gray-600">Balance</h2>
        <p className="text-xl font-bold">$1,655</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-gray-600">Income</h2>
        <p className="text-xl font-bold">$435</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-gray-600">Expenses</h2>
        <p className="text-xl font-bold">$842</p>
      </div>
    </div>
  );
};

export default Overview;

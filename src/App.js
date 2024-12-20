import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import StockPortfolio from "./components/StockPortfolio";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/sidebar' element={<Sidebar />} />
        <Route path='/overview' element={<Overview />} />
        <Route path='/stock' element={<StockPortfolio />} />
        <Route path='/header' element={<Header />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

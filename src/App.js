import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import StockPortfolio from "./components/Analytics";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import Account from "./components/Account";
import Category from "./components/Category";
import Transaction from "./components/Transaction";
import Budget from "./components/Budget";
import Setting from "./components/Setting";
import Goal from "./components/Goal";
import Investment from "./components/Investment";
import Analytics from "./components/Analytics";
import Income from "./components/Income";
import Expense from "./components/Expense";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <Transaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goal"
          element={
            <ProtectedRoute>
              <Goal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sidebar"
          element={
            <ProtectedRoute>
              <Sidebar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <StockPortfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/header"
          element={
            <ProtectedRoute>
              <Header />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investment"
          element={
            <ProtectedRoute>
              <Investment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction/income"
          element={
            <ProtectedRoute>
              <Income />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction/expense"
          element={
            <ProtectedRoute>
              <Expense />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaTachometerAlt, FaMoneyBillAlt, FaChartLine, FaCreditCard, FaHistory, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Import the custom styles for the sidebar
import './index.css';

const CustomSidebar = () => {
  return (
    <Sidebar className="pro-sidebar">
      <div className="sidebar-title">
        PFMS
      </div>
      <Menu iconShape="square">
        <MenuItem icon={<FaTachometerAlt />} className="menu-item">
          <Link to="/dashboard">Dashboard</Link>
        </MenuItem>
        <MenuItem icon={<FaMoneyBillAlt />} className="menu-item">
          <Link to="/payments">Payments</Link>
        </MenuItem>
        <MenuItem icon={<FaChartLine />} className="menu-item">
          <Link to="/analytics">Analytics</Link>
        </MenuItem>
        <MenuItem icon={<FaCreditCard />} className="menu-item">
          <Link to="/cards">Cards</Link>
        </MenuItem>
        <MenuItem icon={<FaHistory />} className="menu-item">
          <Link to="/history">History</Link>
        </MenuItem>
        <MenuItem icon={<FaCog />} className="menu-item">
          <Link to="/services">Services</Link>
        </MenuItem>
        <MenuItem icon={<FaCog />} className="menu-item">
          <Link to="/help">Help</Link>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default CustomSidebar;

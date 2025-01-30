import React, { useState } from 'react';
import {
  HomeIcon,
  UserCircleIcon,
  TagIcon,
  CashIcon,
  AdjustmentsIcon,
  CogIcon,
  LogoutIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  ChartBarIcon,
  ArrowCircleUpIcon,
  ArrowCircleDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isTransactionOpen, setTransactionOpen] = useState(false); // State for dropdown

  const menuItems = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Accounts', path: '/account', icon: UserCircleIcon },
    { name: 'Categories', path: '/category', icon: TagIcon },
  ];

  const otherMenuItems = [
    { name: 'Budget', path: '/budget', icon: CurrencyDollarIcon },
    { name: 'Goals', path: '/goal', icon: AdjustmentsIcon },
    { name: 'Investments', path: '/investment', icon: TrendingUpIcon },
    { name: 'Reports & Analytics', path: '/analytics', icon: ChartBarIcon },
  ];

  return (
    <div className="bg-gray-900 text-white h-screen w-64 p-4 flex flex-col justify-between fixed">
      <div>
        <h1 className="text-lg font-bold mb-8">PFMS</h1>
        <nav>
          {/* Render initial Menu Items */}
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 mb-2 px-3 py-2 rounded-lg transition ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="h-6 w-6" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Transactions with Submenu */}
          <div>
            <button
              className="flex items-center gap-4 mb-2 px-3 py-2 rounded-lg transition hover:bg-gray-800 w-full"
              onClick={() => setTransactionOpen(!isTransactionOpen)}
            >
              <CashIcon className="h-6 w-6" />
              <span>Transactions</span>
              <span className="ml-auto">
                {isTransactionOpen ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </span>
            </button>
            {isTransactionOpen && (
              <div className="ml-12">
                <NavLink
                  to="/transaction/income"
                  className={({ isActive }) =>
                    `flex items-center gap-4 mb-1 px-3 py-2 rounded-lg transition ${
                      isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
                    }`
                  }
                >
                  <ArrowCircleUpIcon className="h-5 w-5" />
                  <span>Income</span>
                </NavLink>
                <NavLink
                  to="/transaction/expense"
                  className={({ isActive }) =>
                    `flex items-center gap-4 mb-2 px-3 py-2 rounded-lg transition ${
                      isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
                    }`
                  }
                >
                  <ArrowCircleDownIcon className="h-5 w-5" />
                  <span>Expense</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Render remaining Menu Items */}
          {otherMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 mb-2 px-3 py-2 rounded-lg transition ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="h-6 w-6" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      {/* Logout NavLink */}
      <NavLink
        to="/logout"
        className="flex items-center gap-4 px-3 py-2 rounded-lg transition bg-red-500 hover:bg-red-900 text-white"
      >
        <LogoutIcon className="h-6 w-6" />
        <span>Logout</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;

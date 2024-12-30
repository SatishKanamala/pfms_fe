import {
  HomeIcon,
  UserCircleIcon,
  TagIcon,
  CashIcon,
  AdjustmentsIcon,
  CogIcon,
  LogoutIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/solid';

import { NavLink } from 'react-router-dom'; // For routing

const Sidebar = () => {
  const menuItems = [
  { name: 'Home', path: '/home', icon: HomeIcon },
  { name: 'Accounts', path: '/account', icon: UserCircleIcon },
  { name: 'Categories', path: '/category', icon: TagIcon },
  { name: 'Transactions', path: '/transaction', icon: CashIcon },
  { name: 'Budget', path: '/budget', icon: CurrencyDollarIcon },
  { name: 'Goals', path: '/goal', icon: AdjustmentsIcon },
  { name: 'Settings', path: '/setting', icon: CogIcon },
  
  ];

  return (
    <div className="bg-gray-900 text-white h-screen w-64 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-lg font-bold mb-8">PFMS</h1>
        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 mb-4 px-3 py-2 rounded-lg transition ${
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

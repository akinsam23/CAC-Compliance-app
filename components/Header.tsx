import React, { useState } from 'react';
import type { User } from '../types';
import { SearchIcon, LogoutIcon } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onSearch }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-5 h-5 text-gray-500" />
          </span>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:focus:bg-gray-600"
            placeholder="Search company..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
          >
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={user.avatarUrl}
              alt={user.name}
            />
            <span className="hidden md:block font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20 dark:bg-gray-800">
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onLogout();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <LogoutIcon className="w-5 h-5 mr-2" />
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

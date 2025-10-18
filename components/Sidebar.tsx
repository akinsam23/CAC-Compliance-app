
import React from 'react';
import { DashboardIcon, ReportsIcon, SettingsIcon } from './Icons';

const Sidebar: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">CAC Bot</h1>
      </div>
      <nav className="mt-6">
        <a href="#" className="flex items-center px-6 py-3 text-white bg-blue-600">
          <DashboardIcon className="w-6 h-6" />
          <span className="mx-4 font-medium">Dashboard</span>
        </a>
        <a href="#" className="flex items-center px-6 py-3 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
          <ReportsIcon className="w-6 h-6" />
          <span className="mx-4 font-medium">Reports</span>
        </a>
        <a href="#" className="flex items-center px-6 py-3 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
          <SettingsIcon className="w-6 h-6" />
          <span className="mx-4 font-medium">Settings</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;

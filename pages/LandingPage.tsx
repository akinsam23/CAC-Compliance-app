import React from 'react';
// Fix: Correctly import icons from the shared Icons component. The local definitions have been moved there.
import { UserGroupIcon, ShieldExclamationIcon } from '../components/Icons';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'signup' | 'adminLogin') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">CAC Compliance Bot</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Automated Annual Returns Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-8">
        {/* Agent Portal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
            <UserGroupIcon className="w-16 h-16 text-blue-500 mb-4"/>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Portal</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 mb-6">Manage client compliance, send reminders, and track filing statuses.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                 <button 
                    onClick={() => onNavigate('login')}
                    className="w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Agent Login
                </button>
                 <button 
                    onClick={() => onNavigate('signup')}
                    className="w-full px-6 py-3 text-lg font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                >
                    Sign Up
                </button>
            </div>
        </div>

        {/* Admin Portal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
            <ShieldExclamationIcon className="w-16 h-16 text-red-500 mb-4"/>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Portal</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 mb-6">System administration, user management, and overall platform oversight.</p>
            <button 
                onClick={() => onNavigate('adminLogin')}
                className="w-full px-6 py-3 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
                Admin Login
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
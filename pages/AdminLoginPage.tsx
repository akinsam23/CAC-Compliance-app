import React, { useState } from 'react';
import { LockClosedIcon, ShieldCheckIcon } from '../components/Icons';
import type { User } from '../types';
import { Role } from '../types';
import { authenticateUser, verify2FACode } from '../services/mockApiService';

interface AdminLoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (page: 'landing') => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('admin@cac.gov.ng');
  const [password, setPassword] = useState('adminpassword');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show2FAStep, setShow2FAStep] = useState(false);
  const [twoFactorInfo, setTwoFactorInfo] = useState({ message: '', codeForDemo: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // We use the same auth function, but will check for role after 2FA
      const response = await authenticateUser(email, password);
      if (response.requires2FA) {
        setTwoFactorInfo({ message: response.message, codeForDemo: response.code });
        setShow2FAStep(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await verify2FACode(email, code);
      if (user.role !== Role.Admin) {
          throw new Error("Access denied. This portal is for administrators only.");
      }
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {show2FAStep ? 'Secure Verification' : 'Administration Portal'}
          </p>
        </div>

        {!show2FAStep ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Admin Email"
            />
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Password"
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 dark:disabled:bg-red-800"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="w-5 h-5 text-red-500 group-hover:text-red-400" />
              </span>
              {isLoading ? 'Authenticating...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handle2FA}>
            <div className="text-center text-gray-600 dark:text-gray-400">
                <p>{twoFactorInfo.message}</p>
                <p className="font-mono text-xs mt-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">For Demo: Your code is <span className="font-bold">{twoFactorInfo.codeForDemo}</span></p>
            </div>
            <input
              name="2fa-code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 text-center tracking-[0.5em] font-mono text-lg bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="∙∙∙∙∙∙"
              maxLength={6}
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 dark:disabled:bg-green-800"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <ShieldCheckIcon className="w-5 h-5 text-green-500 group-hover:text-green-400" />
              </span>
              {isLoading ? 'Verifying...' : 'Log In'}
            </button>
          </form>
        )}
        <div className="text-sm text-center">
            <button onClick={() => onNavigate('landing')} className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400">
                Return to Main Portal Selection
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

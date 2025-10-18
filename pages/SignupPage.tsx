import React, { useState } from 'react';
// Fix: Correctly import UserAddIcon from the shared Icons component. The local definition has been moved there.
import { UserAddIcon } from '../components/Icons';
import { registerUser } from '../services/mockApiService';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onNavigate: (page: 'login' | 'landing') => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(name, email, password);
      setSuccess("Account created successfully! You can now log in.");
      setTimeout(() => {
        onSignupSuccess();
      }, 2000);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Agent Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Join the CAC Compliance Network</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
             <input
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Full Name"
            />
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Email address"
            />
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Password (min. 8 characters)"
            />
             <input
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Confirm Password"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm text-green-500 text-center">{success}</p>}


          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <UserAddIcon className="w-5 h-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
         <div className="text-sm text-center">
            <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Already have an account? Sign in
            </button>
             <span className="mx-2 text-gray-400">|</span>
             <button onClick={() => onNavigate('landing')} className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400">
              Back to Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
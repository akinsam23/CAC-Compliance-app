import React, { useState, useCallback, useMemo } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LandingPage from './pages/LandingPage';
import type { User } from './types';
import { Role } from './types';

type Page = 'landing' | 'login' | 'signup' | 'dashboard' | 'adminLogin' | 'adminDashboard';

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = useCallback((user: User) => {
    setCurrentUser(user);
    if (user.role === Role.Admin) {
      setPage('adminDashboard');
    } else {
      setPage('dashboard');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setPage('landing');
  }, []);

  const user = useMemo(() => {
    if (!currentUser) return null;
    return {
      ...currentUser,
      avatarUrl: `https://i.pravatar.cc/150?u=${currentUser.email}`
    };
  }, [currentUser]);

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <LandingPage onNavigate={setPage} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setPage} />;
      case 'signup':
        return <SignupPage onSignupSuccess={() => setPage('login')} onNavigate={setPage} />;
      case 'adminLogin':
        return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setPage} />;
      case 'dashboard':
        if (user) {
          return <DashboardPage user={user} onLogout={handleLogout} />;
        }
        setPage('login'); // Fallback if no user
        return null;
      case 'adminDashboard':
        if (user && user.role === Role.Admin) {
          return <AdminDashboardPage user={user} onLogout={handleLogout} />;
        }
        setPage('adminLogin'); // Fallback if not admin
        return null;
      default:
        return <LandingPage onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      {renderPage()}
    </div>
  );
}

export default App;

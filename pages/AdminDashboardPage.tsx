import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { Permission } from '../types';
import { getAdmins, createAdmin } from '../services/mockApiService';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { CloseIcon } from '../components/Icons';

interface AdminDashboardPageProps {
  user: User;
  onLogout: () => void;
}

const AddAdminModal: React.FC<{ onClose: () => void; onAdminAdded: (admin: User) => void }> = ({ onClose, onAdminAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePermissionChange = (permission: Permission) => {
        setPermissions(prev => 
            prev.includes(permission) 
                ? prev.filter(p => p !== permission) 
                : [...prev, permission]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !email || permissions.length === 0) {
            setError("All fields are required.");
            return;
        }
        setIsLoading(true);
        try {
            const newAdmin = await createAdmin(name, email, permissions);
            onAdminAdded(newAdmin);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Admin</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full px-3 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-3 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
              <div>
                <h3 className="font-semibold mb-2 dark:text-white">Permissions</h3>
                <div className="space-y-2">
                    {Object.values(Permission).map(p => (
                        <label key={p} className="flex items-center space-x-3">
                            <input type="checkbox" checked={permissions.includes(p)} onChange={() => handlePermissionChange(p)} className="form-checkbox h-5 w-5 text-blue-600 rounded dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">{p.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </label>
                    ))}
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300">{isLoading ? 'Adding...' : 'Add Admin'}</button>
              </div>
            </form>
          </div>
        </div>
    );
};

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ user, onLogout }) => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadAdmins = useCallback(async () => {
    setIsLoading(true);
    const data = await getAdmins();
    setAdmins(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);
  
  const handleAdminAdded = (newAdmin: User) => {
    setAdmins(prev => [...prev, newAdmin]);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} onSearch={() => {}} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Admin Management</h1>
                 <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Admin</button>
            </div>
            
             <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Permissions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                       {isLoading ? (
                           <tr><td colSpan={3} className="text-center py-10">Loading admins...</td></tr>
                       ) : admins.map(admin => (
                           <tr key={admin.id}>
                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{admin.name}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{admin.email}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                   <div className="flex flex-wrap gap-1">
                                    {admin.permissions.map(p => <span key={p} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{p.split('_')[0]}</span>)}
                                   </div>
                               </td>
                           </tr>
                       ))}
                    </tbody>
                </table>
             </div>
          </div>
        </main>
      </div>
      {showAddModal && <AddAdminModal onClose={() => setShowAddModal(false)} onAdminAdded={handleAdminAdded} />}
    </div>
  );
};

export default AdminDashboardPage;

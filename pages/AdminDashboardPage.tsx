
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Company, User } from '../types';
import { Permission } from '../types';
import { fetchCompanies, getAdmins } from '../services/mockApiService';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ComplianceTable from '../components/ComplianceTable';
import CompanyDetailModal from '../components/CompanyDetailModal';
import AddCompanyModal from '../components/AddCompanyModal';

interface AdminDashboardPageProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ user, onLogout }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [companyData, adminData] = await Promise.all([
          fetchCompanies(),
          getAdmins(),
        ]);
        setCompanies(companyData);
        setAdmins(adminData);
      } catch (error) {
        console.error("Failed to load admin dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    return companies.filter(company =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };
  
  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    if (selectedCompany?.id === updatedCompany.id) {
        setSelectedCompany(updatedCompany);
    }
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
  };
  
  const handleCompanyAdded = useCallback((newCompany: Company) => {
      setCompanies(prev => [newCompany, ...prev]);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} onSearch={setSearchTerm} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Admin Dashboard</h1>
              {user.permissions.includes(Permission.CreateCompanyRecord) && (
                <button 
                  onClick={() => setShowAddCompanyModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add New Company
                </button>
              )}
            </div>
            
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Company Records Management</h2>
              <ComplianceTable
                companies={filteredCompanies}
                isLoading={loading}
                onSelectCompany={handleSelectCompany}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">System Administrators</h2>
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                          <tr><td colSpan={3} className="text-center py-10 text-gray-500 dark:text-gray-400">Loading...</td></tr>
                      ) : admins.map(admin => (
                        <tr key={admin.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{admin.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{admin.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                {admin.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={handleCloseModal}
          onUpdate={handleUpdateCompany}
        />
      )}
      {showAddCompanyModal && (
        <AddCompanyModal 
          onClose={() => setShowAddCompanyModal(false)}
          onCompanyAdded={handleCompanyAdded}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;

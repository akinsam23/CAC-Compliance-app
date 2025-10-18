import React, { useState, useEffect, useMemo } from 'react';
import type { Company, User } from '../types';
import { ComplianceStatus } from '../types';
import { fetchCompanies } from '../services/mockApiService';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ComplianceTable from '../components/ComplianceTable';
import CompanyDetailModal from '../components/CompanyDetailModal';
import DashboardMetrics from '../components/DashboardMetrics';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all'>('all');

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      const data = await fetchCompanies();
      setCompanies(data);
      setLoading(false);
    };
    loadCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies
      .filter(company => 
        statusFilter === 'all' || company.returnsStatus === statusFilter
      )
      .filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [companies, searchTerm, statusFilter]);

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };
  
  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    setSelectedCompany(updatedCompany);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} onSearch={setSearchTerm} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Compliance Dashboard</h1>
            <DashboardMetrics companies={companies} onFilterChange={setStatusFilter} activeFilter={statusFilter}/>
            <ComplianceTable
              companies={filteredCompanies}
              isLoading={loading}
              onSelectCompany={handleSelectCompany}
            />
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
    </div>
  );
};

export default DashboardPage;

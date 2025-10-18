
import React, { useState, useCallback } from 'react';
import type { Company } from '../types';
import { ComplianceStatus } from '../types';
import { updateCompanyStatus } from '../services/mockApiService';
import { generateReminderEmail } from '../services/geminiService';
import StatusBadge from './StatusBadge';
import { CloseIcon, SparklesIcon, PaperAirplaneIcon } from './Icons';

interface CompanyDetailModalProps {
  company: Company;
  onClose: () => void;
  onUpdate: (company: Company) => void;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ company, onClose, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');

  const handleStatusChange = async (newStatus: ComplianceStatus) => {
    setIsUpdating(true);
    try {
      const updatedCompany = await updateCompanyStatus(company.id, newStatus);
      onUpdate(updatedCompany);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleGenerateEmail = useCallback(async () => {
    setIsGeneratingEmail(true);
    setGeneratedEmail('');
    const emailText = await generateReminderEmail(company);
    setGeneratedEmail(emailText);
    setIsGeneratingEmail(false);
  }, [company]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{company.companyName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Filing Year: {company.filingYear}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <StatusBadge status={company.returnsStatus} />
            </div>
             <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Email</h3>
                <p className="text-gray-900 dark:text-white">{company.clientEmail}</p>
            </div>
             <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Contact Date</h3>
                <p className="text-gray-900 dark:text-white">{company.lastContactDate}</p>
            </div>
             <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Agent Email</h3>
                <p className="text-gray-900 dark:text-white">{company.agentEmail}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
             <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Manual Actions</h3>
             <div className="flex items-center space-x-2">
                 <label htmlFor="status-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Status:</label>
                 <select 
                    id="status-select"
                    value={company.returnsStatus}
                    onChange={(e) => handleStatusChange(e.target.value as ComplianceStatus)}
                    disabled={isUpdating}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 >
                     {Object.values(ComplianceStatus).map(status => (
                         <option key={status} value={status}>{status}</option>
                     ))}
                 </select>
                 {isUpdating && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">AI Assistant</h3>
            <button
              onClick={handleGenerateEmail}
              disabled={isGeneratingEmail}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isGeneratingEmail ? 'Generating...' : 'Generate Reminder Email'}
            </button>
            {generatedEmail && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
                <code>{generatedEmail}</code>
                <button className="flex items-center mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                    <PaperAirplaneIcon className="w-4 h-4 mr-1"/> Send to Client
                </button>
              </div>
            )}
             {isGeneratingEmail && (
                 <div className="mt-4 p-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">AI is drafting the email...</p>
                 </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;

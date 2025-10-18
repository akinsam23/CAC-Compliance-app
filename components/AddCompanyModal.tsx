import React, { useState } from 'react';
import type { Company } from '../types';
import { ComplianceStatus } from '../types';
import { createCompany } from '../services/mockApiService';
import { CloseIcon } from './Icons';

interface AddCompanyModalProps {
  onClose: () => void;
  onCompanyAdded: (company: Company) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ onClose, onCompanyAdded }) => {
    const [companyName, setCompanyName] = useState('');
    const [agentEmail, setAgentEmail] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [filingYear, setFilingYear] = useState(new Date().getFullYear());
    const [returnsStatus, setReturnsStatus] = useState<ComplianceStatus>(ComplianceStatus.Pending);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!companyName || !agentEmail || !clientEmail || !filingYear) {
            setError("All fields must be filled.");
            return;
        }
        setIsLoading(true);
        try {
            const newCompany = await createCompany(companyName, agentEmail, clientEmail, filingYear, returnsStatus);
            onCompanyAdded(newCompany);
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Company Record</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company Name" required className="w-full px-3 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" />
                    <input type="email" value={agentEmail} onChange={e => setAgentEmail(e.target.value)} placeholder="Agent Email" required className="w-full px-3 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" />
                    <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="Client Email" required className="w-full px-3 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" />
                    
                    <div className="grid grid-cols-2 gap-4">
                         <input type="number" value={filingYear} onChange={e => setFilingYear(parseInt(e.target.value, 10))} placeholder="Filing Year" required className="w-full px-3 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" />
                        <select 
                            value={returnsStatus}
                            onChange={(e) => setReturnsStatus(e.target.value as ComplianceStatus)}
                            className="w-full px-3 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        >
                            {Object.values(ComplianceStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300">{isLoading ? 'Adding...' : 'Add Company'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCompanyModal;


import React, { useMemo } from 'react';
import type { Company } from '../types';
import { ComplianceStatus } from '../types';

interface DashboardMetricsProps {
    companies: Company[];
    onFilterChange: (status: ComplianceStatus | 'all') => void;
    activeFilter: ComplianceStatus | 'all';
}

interface Metric {
    label: string;
    value: number;
    status: ComplianceStatus | 'all';
    color: string;
}

const MetricCard: React.FC<{ metric: Metric; isActive: boolean; onClick: () => void; }> = ({ metric, isActive, onClick }) => {
    const activeClasses = 'ring-2 ring-offset-2 dark:ring-offset-gray-900';
    return (
        <button 
            onClick={onClick}
            className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200 focus:outline-none ${isActive ? `${metric.color} ${activeClasses}` : ''}`}
        >
            <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-white ${metric.color}`}>
                <span className="text-xl font-bold">{metric.value}</span>
            </div>
            <div>
                <div className="text-lg font-medium text-black dark:text-white text-left">{metric.label}</div>
            </div>
        </button>
    );
};

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ companies, onFilterChange, activeFilter }) => {
    const metrics = useMemo<Metric[]>(() => {
        const counts = companies.reduce((acc, company) => {
            acc[company.returnsStatus] = (acc[company.returnsStatus] || 0) + 1;
            return acc;
        }, {} as Record<ComplianceStatus, number>);

        return [
            { label: 'Total Clients', value: companies.length, status: 'all', color: 'bg-gray-500' },
            { label: 'Filed', value: counts[ComplianceStatus.Filed] || 0, status: ComplianceStatus.Filed, color: 'bg-green-500' },
            { label: 'Pending', value: counts[ComplianceStatus.Pending] || 0, status: ComplianceStatus.Pending, color: 'bg-yellow-500' },
            { label: 'Awaiting', value: counts[ComplianceStatus.AwaitingResponse] || 0, status: ComplianceStatus.AwaitingResponse, color: 'bg-blue-500' },
            { label: 'Overdue', value: counts[ComplianceStatus.Overdue] || 0, status: ComplianceStatus.Overdue, color: 'bg-red-500' },
        ];
    }, [companies]);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-6">
            {metrics.map(metric => (
                <MetricCard 
                    key={metric.status} 
                    metric={metric} 
                    isActive={activeFilter === metric.status}
                    onClick={() => onFilterChange(metric.status)}
                />
            ))}
        </div>
    );
};

export default DashboardMetrics;

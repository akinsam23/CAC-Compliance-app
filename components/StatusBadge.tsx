
import React from 'react';
import { ComplianceStatus } from '../types';

interface StatusBadgeProps {
  status: ComplianceStatus;
}

const statusStyles: Record<ComplianceStatus, string> = {
  [ComplianceStatus.Filed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ComplianceStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ComplianceStatus.AwaitingResponse]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [ComplianceStatus.Overdue]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

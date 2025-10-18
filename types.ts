export enum ComplianceStatus {
  Filed = 'Filed',
  Pending = 'Pending',
  AwaitingResponse = 'Awaiting Response',
  Overdue = 'Overdue',
}

export interface Company {
  id: string;
  companyName: string;
  agentEmail: string;
  clientEmail: string;
  lastContactDate: string;
  returnsStatus: ComplianceStatus;
  filingYear: number;
}

export enum Role {
    Agent = 'agent',
    Admin = 'admin',
}

export enum Permission {
    CreateUsers = 'CREATE_USERS',
    DeleteUsers = 'DELETE_USERS',
    DeleteCompanyRecords = 'DELETE_COMPANY_RECORDS',
    ViewAllRecords = 'VIEW_ALL_RECORDS',
    CreateCompanyRecord = 'CREATE_COMPANY_RECORD',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client in real app
  avatarUrl?: string;
  role: Role;
  permissions: Permission[];
  twoFactorCode?: string;
  twoFactorCodeExpires?: Date;
}
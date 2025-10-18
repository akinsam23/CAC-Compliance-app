import type { Company, User } from '../types';
import { ComplianceStatus, Role, Permission } from '../types';

// --- MOCK DATABASE ---

const initialCompanies: Company[] = [
  { id: '1', companyName: 'Innovate Nigeria PLC', agentEmail: 'agent@cac.gov.ng', clientEmail: 'client1@test.com', lastContactDate: '2024-03-01', returnsStatus: ComplianceStatus.Filed, filingYear: 2023 },
  { id: '2', companyName: 'Lagos Tech Hub Ltd', agentEmail: 'agent@cac.gov.ng', clientEmail: 'client2@test.com', lastContactDate: '2024-05-15', returnsStatus: ComplianceStatus.Pending, filingYear: 2023 },
  { id: '3', companyName: 'Abuja Logistics Inc.', agentEmail: 'agent@cac.gov.ng', clientEmail: 'client3@test.com', lastContactDate: '2024-05-10', returnsStatus: ComplianceStatus.AwaitingResponse, filingYear: 2023 },
  { id: '4', companyName: 'Port Harcourt Energy Corp', agentEmail: 'agent@cac.gov.ng', clientEmail: 'client4@test.com', lastContactDate: '2024-04-20', returnsStatus: ComplianceStatus.Overdue, filingYear: 2023 },
  { id: '5', companyName: 'Kano Textiles Co.', agentEmail: 'agent@cac.gov.ng', clientEmail: 'client5@test.com', lastContactDate: '2024-05-18', returnsStatus: ComplianceStatus.Pending, filingYear: 2023 },
];

let companies: Company[] = [...initialCompanies];

let users: User[] = [
    {
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@cac.gov.ng',
        password: 'adminpassword',
        role: Role.Admin,
        permissions: [Permission.CreateUsers, Permission.DeleteUsers, Permission.DeleteCompanyRecords, Permission.ViewAllRecords, Permission.CreateCompanyRecord],
    },
    {
        id: 'user-2',
        name: 'CAC Agent',
        email: 'agent@cac.gov.ng',
        password: 'password123',
        role: Role.Agent,
        permissions: [Permission.ViewAllRecords],
    },
];

// --- API FUNCTIONS ---

const simulateNetwork = (delay = 500) => new Promise(res => setTimeout(res, delay));


// Company Functions
export const fetchCompanies = async (): Promise<Company[]> => {
  await simulateNetwork();
  // Return a copy to prevent direct mutation from components
  return [...companies];
};

export const updateCompanyStatus = async (companyId: string, status: ComplianceStatus): Promise<Company> => {
    await simulateNetwork(300);
    const companyIndex = companies.findIndex(c => c.id === companyId);
    if (companyIndex !== -1) {
        companies[companyIndex] = {
            ...companies[companyIndex],
            returnsStatus: status,
            lastContactDate: new Date().toISOString().split('T')[0]
        };
        return companies[companyIndex];
    }
    throw new Error("Company not found");
};

export const createCompany = async (
    companyName: string,
    agentEmail: string,
    clientEmail: string,
    filingYear: number,
    returnsStatus: ComplianceStatus
): Promise<Company> => {
    await simulateNetwork();
    if (companies.some(c => c.companyName.toLowerCase() === companyName.toLowerCase() && c.filingYear === filingYear)) {
        throw new Error("A record for this company and filing year already exists.");
    }
    const newCompany: Company = {
        id: `comp-${Date.now()}`,
        companyName,
        agentEmail,
        clientEmail,
        filingYear,
        returnsStatus,
        lastContactDate: new Date().toISOString().split('T')[0],
    };
    companies.push(newCompany);
    return newCompany;
};


// User & Auth Functions
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
    await simulateNetwork();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("User with this email already exists.");
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: Role.Agent,
        permissions: [Permission.ViewAllRecords]
    };
    users.push(newUser);
    const { password: _, ...userToReturn } = newUser;
    return userToReturn;
};

export const authenticateUser = async (email: string, password: string):Promise<{ requires2FA: true; message: string; code: string } | { requires2FA: false, user: User}> => {
    await simulateNetwork();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
        throw new Error("Invalid email or password.");
    }
    
    // Generate 2FA code
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFactorCodeExpires = new Date(new Date().getTime() + 5 * 60000); // 5 minutes expiry

    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = { ...users[userIndex], twoFactorCode, twoFactorCodeExpires };
    
    console.log(`[Mock API] 2FA Code for ${email}: ${twoFactorCode}`);
    
    return {
        requires2FA: true,
        message: 'A 6-digit verification code has been sent to your email.',
        code: twoFactorCode // Returning for demo purposes
    };
};

export const verify2FACode = async (email: string, code: string): Promise<User> => {
    await simulateNetwork();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
        throw new Error("User not found.");
    }

    const user = users[userIndex];
    
    if (user.twoFactorCode !== code || (user.twoFactorCodeExpires && user.twoFactorCodeExpires < new Date())) {
        throw new Error("Invalid or expired authentication code.");
    }
    
    // Clear the code after successful verification
    users[userIndex].twoFactorCode = undefined;
    users[userIndex].twoFactorCodeExpires = undefined;

    const { password: _, ...userToReturn } = user;
    return userToReturn;
};

// Admin Functions
export const getAdmins = async (): Promise<User[]> => {
    await simulateNetwork();
    return users.filter(u => u.role === Role.Admin).map(u => {
        const { password, ...user } = u;
        return user;
    });
};

export const createAdmin = async (name: string, email: string, permissions: Permission[]): Promise<User> => {
    await simulateNetwork();
     if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("User with this email already exists.");
    }
    const newAdmin: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password: 'defaultPassword', // In a real app, you'd send an invite link
        role: Role.Admin,
        permissions,
    };
    users.push(newAdmin);
    const { password: _, ...userToReturn } = newAdmin;
    return userToReturn;
};

export const deleteAdmin = async (adminIdToDelete: string, currentAdminId: string): Promise<void> => {
    await simulateNetwork();
    if (adminIdToDelete === currentAdminId) {
        throw new Error("You cannot delete your own account.");
    }

    const userIndex = users.findIndex(u => u.id === adminIdToDelete && u.role === Role.Admin);
    if (userIndex === -1) {
        throw new Error("Admin user not found.");
    }

    users.splice(userIndex, 1);
};
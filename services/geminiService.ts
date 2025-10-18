
import { GoogleGenAI } from "@google/genai";
import type { Company } from '../types';
import { ComplianceStatus } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

function getStatusContext(status: ComplianceStatus): string {
    switch(status) {
        case ComplianceStatus.Pending:
            return "The filing is pending and the deadline is approaching.";
        case ComplianceStatus.AwaitingResponse:
            return "We have sent a reminder but have not received a 'YES' or 'NO' confirmation yet.";
        case ComplianceStatus.Overdue:
            return "The filing deadline has passed and this is an urgent reminder.";
        case ComplianceStatus.Filed:
            return "The filing is complete. This is a confirmation or follow-up email.";
        default:
            return "There is an update regarding their annual returns filing.";
    }
}

export const generateReminderEmail = async (company: Company): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve(`Subject: Reminder: Annual Returns Filing for ${company.companyName}

Dear Client,

This is a friendly reminder regarding the annual returns filing for ${company.companyName} for the year ${company.filingYear}. 

Our records show the current status as: **${company.returnsStatus}**.

Please reply "YES" if the returns have been filed or "NO" if they have not.

Thank you,
Your CAC Agent

(This is a mock email because the Gemini API key is not configured.)`);
    }

    const prompt = `
        You are a professional assistant for a Corporate Affairs Commission (CAC) agent in Nigeria.
        Your task is to draft a concise and professional reminder email to a client regarding their annual returns filing.

        **Client Details:**
        - Company Name: ${company.companyName}
        - Filing Year: ${company.filingYear}
        - Current Status: ${company.returnsStatus}

        **Context for the email:**
        ${getStatusContext(company.returnsStatus)}

        **Instructions:**
        1.  Generate a clear subject line starting with "Reminder:", "Urgent:", or "Follow-up:".
        2.  Keep the email body professional, friendly, and to the point.
        3.  Explicitly mention the company name and filing year.
        4.  Crucially, ask the client to reply with a simple "YES" if the returns are filed, or "NO" if they are not. This is for our automated tracking system.
        5.  Do not include any placeholders like "[Client Name]" or "[Agent Name]". The email should be ready to send.
        6.  The output should be the full email text, including "Subject: " at the beginning.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating email with Gemini API:", error);
        return "Error: Could not generate email. Please check the console for details.";
    }
};

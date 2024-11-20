import { Handler } from '@netlify/functions';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

interface CompromisedAccount {
  id: string;
  username: string;
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'disabled' | 'locked';
  indicators: string[];
  mitigationSteps: string[];
}

// Initialize notification services
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const notifyAdmins = async (account: CompromisedAccount, action: string) => {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const adminPhones = process.env.ADMIN_PHONES?.split(',') || [];

  // Send email notifications
  const emailPromises = adminEmails.map(email => 
    sgMail.send({
      to: email,
      from: 'security@serius.io',
      subject: `[ALERT] Compromised Account Action Required`,
      text: `
        Account ${account.username} has been ${action}.
        Risk Level: ${account.riskLevel}
        Last Activity: ${account.lastActivity}
        
        Suspicious Indicators:
        ${account.indicators.join('\n')}
        
        Required Actions:
        ${account.mitigationSteps.join('\n')}
      `
    })
  );

  // Send SMS notifications
  const smsPromises = adminPhones.map(phone =>
    twilioClient.messages.create({
      body: `[SERIUS.IO] Alert: Account ${account.username} ${action}. Risk Level: ${account.riskLevel}`,
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER
    })
  );

  await Promise.all([...emailPromises, ...smsPromises]);
};

// Mock data for demonstration
const mockAccounts: CompromisedAccount[] = [
  {
    id: '1',
    username: 'admin.user',
    lastActivity: new Date().toISOString(),
    riskLevel: 'critical',
    status: 'active',
    indicators: [
      'Multiple failed 2FA attempts',
      'Access from unusual location',
      'Suspicious file access patterns'
    ],
    mitigationSteps: [
      'Reset account credentials',
      'Review recent activity logs',
      'Enable enhanced monitoring'
    ]
  },
  {
    id: '2',
    username: 'service.account',
    lastActivity: new Date().toISOString(),
    riskLevel: 'high',
    status: 'active',
    indicators: [
      'Unusual API access patterns',
      'Elevated privilege usage',
      'Off-hours activity'
    ],
    mitigationSteps: [
      'Rotate API keys',
      'Review service permissions',
      'Update access policies'
    ]
  }
];

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ accounts: mockAccounts })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const { accountId, action } = JSON.parse(event.body || '{}');
      
      const account = mockAccounts.find(a => a.id === accountId);
      if (!account) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Account not found' })
        };
      }

      // Update account status
      account.status = action === 'disable' ? 'disabled' : 'locked';
      
      // Notify administrators
      await notifyAdmins(account, action);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Account ${action}d successfully`,
          account
        })
      };
    } catch (error) {
      console.error('Account management error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to manage account' })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
import { Handler } from '@netlify/functions';
import { randomUUID } from 'crypto';

interface IaCTemplate {
  id: string;
  name: string;
  type: 'terraform' | 'cloudformation' | 'kubernetes';
  status: 'secure' | 'warning' | 'critical';
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastScanned: string;
  findings: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    rule: string;
    description: string;
    recommendation: string;
  }[];
}

const mockAnalysis = (filename: string): IaCTemplate => ({
  id: randomUUID(),
  name: filename,
  type: filename.endsWith('.tf') 
    ? 'terraform' 
    : filename.endsWith('.yaml') || filename.endsWith('.yml')
    ? 'kubernetes'
    : 'cloudformation',
  status: 'warning',
  issues: {
    critical: 1,
    high: 2,
    medium: 3,
    low: 4
  },
  lastScanned: new Date().toISOString(),
  findings: [
    {
      severity: 'critical',
      rule: 'SEC-001',
      description: 'Unencrypted storage detected',
      recommendation: 'Enable encryption at rest for all storage resources'
    },
    {
      severity: 'high',
      rule: 'SEC-002',
      description: 'Public network exposure',
      recommendation: 'Restrict network access using security groups'
    },
    {
      severity: 'medium',
      rule: 'SEC-003',
      description: 'Insufficient logging configuration',
      recommendation: 'Enable detailed logging and monitoring'
    }
  ]
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Handle file upload
    if (event.headers['content-type']?.includes('multipart/form-data')) {
      const filename = event.headers['x-file-name'] || 'template.tf';
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Template analyzed successfully',
          template: mockAnalysis(filename)
        })
      };
    }

    // Handle scan request
    const { templateId } = JSON.parse(event.body || '{}');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Analysis completed',
        template: mockAnalysis('updated-template.tf')
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to analyze template'
      })
    };
  }
};
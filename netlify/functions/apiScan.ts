import { Handler } from '@netlify/functions';
import { randomUUID } from 'crypto';

interface APIEndpoint {
  id: string;
  url: string;
  method: string;
  status: 'secure' | 'warning' | 'critical';
  lastScanned: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  findings: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    description: string;
    recommendation: string;
  }[];
}

// Mock data for demonstration
const mockEndpoints: APIEndpoint[] = [
  {
    id: randomUUID(),
    url: 'https://api.example.com/users',
    method: 'GET',
    status: 'warning',
    lastScanned: new Date().toISOString(),
    vulnerabilities: {
      critical: 1,
      high: 2,
      medium: 3,
      low: 4
    },
    findings: [
      {
        severity: 'critical',
        category: 'Authentication',
        description: 'Missing rate limiting controls',
        recommendation: 'Implement API rate limiting to prevent brute force attacks'
      },
      {
        severity: 'high',
        category: 'Data Exposure',
        description: 'Sensitive data in response',
        recommendation: 'Implement response filtering and data masking'
      }
    ]
  }
];

const mockScan = (endpoint: APIEndpoint): APIEndpoint => ({
  ...endpoint,
  lastScanned: new Date().toISOString(),
  vulnerabilities: {
    critical: Math.floor(Math.random() * 2),
    high: Math.floor(Math.random() * 3),
    medium: Math.floor(Math.random() * 4),
    low: Math.floor(Math.random() * 5)
  },
  findings: [
    {
      severity: 'high',
      category: 'Security Headers',
      description: 'Missing security headers',
      recommendation: 'Add HSTS, CSP, and other security headers'
    },
    {
      severity: 'medium',
      category: 'Input Validation',
      description: 'Insufficient input validation',
      recommendation: 'Implement strict input validation and sanitization'
    }
  ]
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        endpoints: mockEndpoints
      })
    };
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');

    // Handle new endpoint creation
    if (body.url && body.method) {
      const newEndpoint: APIEndpoint = {
        id: randomUUID(),
        url: body.url,
        method: body.method,
        status: 'secure',
        lastScanned: new Date().toISOString(),
        vulnerabilities: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        findings: []
      };

      mockEndpoints.push(newEndpoint);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Endpoint added successfully',
          endpoint: newEndpoint
        })
      };
    }

    // Handle endpoint scanning
    if (body.endpointId && body.action === 'scan') {
      const endpoint = mockEndpoints.find(e => e.id === body.endpointId);
      if (!endpoint) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Endpoint not found' })
        };
      }

      const scannedEndpoint = mockScan(endpoint);
      Object.assign(endpoint, scannedEndpoint);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Scan completed',
          endpoint: scannedEndpoint
        })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
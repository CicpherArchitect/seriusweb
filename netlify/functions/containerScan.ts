import { Handler } from '@netlify/functions';
import Docker from 'dockerode';
import { randomUUID } from 'crypto';

interface ContainerScan {
  id: string;
  name: string;
  image: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  status: 'secure' | 'warning' | 'critical';
  lastScanned: string;
}

// Mock data for demonstration
const mockContainers: ContainerScan[] = [
  {
    id: randomUUID(),
    name: 'web-app',
    image: 'nginx:latest',
    vulnerabilities: {
      critical: 1,
      high: 3,
      medium: 5,
      low: 8
    },
    status: 'critical',
    lastScanned: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'api-service',
    image: 'node:16',
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 4,
      low: 6
    },
    status: 'warning',
    lastScanned: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'redis-cache',
    image: 'redis:alpine',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 3
    },
    status: 'secure',
    lastScanned: new Date().toISOString()
  }
];

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        containers: mockContainers
      })
    };
  }

  if (event.httpMethod === 'POST') {
    const { containerId } = JSON.parse(event.body || '{}');
    
    // In a real implementation, this would:
    // 1. Connect to Docker daemon
    // 2. Scan the specified container
    // 3. Update vulnerability database
    // 4. Return real results

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scan completed',
        containerId,
        timestamp: new Date().toISOString()
      })
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
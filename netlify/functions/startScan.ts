import { Handler } from '@netlify/functions';
import { randomUUID } from 'crypto';

interface Device {
  id: string;
  ip: string;
  mac: string;
  hostname: string;
  status: 'online' | 'offline';
  type: string;
  lastSeen: string;
}

interface ScanStatus {
  deviceId: string;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  progress: number;
  findings: string[];
}

// Mock devices for demonstration
const mockDevices: Device[] = [
  {
    id: randomUUID(),
    ip: '192.168.1.100',
    mac: '00:1A:2B:3C:4D:5E',
    hostname: 'workstation-1',
    status: 'online',
    type: 'workstation',
    lastSeen: new Date().toISOString()
  },
  {
    id: randomUUID(),
    ip: '192.168.1.101',
    mac: '00:1A:2B:3C:4D:5F',
    hostname: 'server-1',
    status: 'online',
    type: 'server',
    lastSeen: new Date().toISOString()
  }
];

const simulateScan = async (deviceId: string): Promise<ScanStatus> => {
  // Simulate scan progress
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    deviceId,
    status: 'completed',
    progress: 100,
    findings: [
      'Discovered open ports: 80, 443, 22',
      'Detected outdated software versions',
      'Found suspicious network traffic patterns'
    ]
  };
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { deviceIds } = JSON.parse(event.body || '{}');
    
    // Start scans for each device
    const scanPromises = deviceIds.map(simulateScan);
    const results = await Promise.all(scanPromises);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scan completed',
        scanId: randomUUID(),
        results
      })
    };
  } catch (error) {
    console.error('Scan error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to start scan'
      })
    };
  }
}
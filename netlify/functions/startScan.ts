import { Handler } from '@netlify/functions';
import { Server } from 'socket.io';
import { randomUUID } from 'crypto';

interface ScanRequest {
  deviceIds: string[];
}

interface ScanStatus {
  deviceId: string;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  progress: number;
  findings: string[];
}

const io = new Server();

const simulateScan = async (deviceId: string) => {
  const status: ScanStatus = {
    deviceId,
    status: 'scanning',
    progress: 0,
    findings: []
  };

  // Simulate scan progress
  for (let i = 0; i <= 100; i += 10) {
    status.progress = i;

    if (i === 30) {
      status.findings.push('Discovered open ports: 80, 443, 22');
    }
    if (i === 60) {
      status.findings.push('Detected outdated software versions');
    }
    if (i === 90) {
      status.findings.push('Found suspicious network traffic patterns');
    }

    io.emit('scanUpdate', status);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  status.status = 'completed';
  io.emit('scanUpdate', status);
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { deviceIds } = JSON.parse(event.body || '{}') as ScanRequest;

    // Start scans for each device
    deviceIds.forEach(deviceId => {
      simulateScan(deviceId);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scan initiated',
        scanId: randomUUID()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to start scan'
      })
    };
  }
};
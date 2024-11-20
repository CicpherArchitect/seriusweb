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

export const handler: Handler = async (event) => {
  // Handle WebSocket upgrade
  if (event.headers.upgrade?.toLowerCase() === 'websocket') {
    return {
      statusCode: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Accept': 'mock-accept-key'
      }
    };
  }

  // Handle regular HTTP requests
  if (event.httpMethod === 'POST') {
    const message = JSON.parse(event.body || '{}');
    
    if (message.type === 'startDiscovery') {
      // In a real implementation, this would trigger actual network scanning
      return {
        statusCode: 200,
        body: JSON.stringify({
          type: 'deviceDiscovered',
          devices: mockDevices
        })
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Network scanner endpoint' })
  };
};
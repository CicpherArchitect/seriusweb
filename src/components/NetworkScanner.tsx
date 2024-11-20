import React, { useState, useEffect, useCallback } from 'react';
import { Scan, Loader2, Shield, AlertTriangle } from 'lucide-react';

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

const NetworkScanner: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanStatuses, setScanStatuses] = useState<Record<string, ScanStatus>>({});
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const setupWebSocket = useCallback(() => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/.netlify/functions/networkScanner`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({ type: 'startDiscovery' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'deviceDiscovered':
          setDevices(prev => [...prev, data.device]);
          break;
        case 'scanUpdate':
          setScanStatuses(prev => ({
            ...prev,
            [data.status.deviceId]: data.status
          }));
          break;
        case 'error':
          setError(data.message);
          break;
      }
    };

    socket.onerror = () => {
      setError('WebSocket connection error');
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(setupWebSocket, 5000); // Reconnect after 5 seconds
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    setupWebSocket();
  }, [setupWebSocket]);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const startScan = async () => {
    if (selectedDevices.length === 0) {
      setError('Please select at least one device to scan');
      return;
    }

    setScanning(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/startScan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceIds: selectedDevices })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate scan');
      }

      // Initialize scan statuses
      const initialStatuses: Record<string, ScanStatus> = {};
      selectedDevices.forEach(deviceId => {
        initialStatuses[deviceId] = {
          deviceId,
          status: 'pending',
          progress: 0,
          findings: []
        };
      });
      setScanStatuses(initialStatuses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setScanning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Network Scanner</h2>
        <button
          onClick={startScan}
          disabled={scanning || selectedDevices.length === 0}
          className={`btn-primary flex items-center ${
            scanning || selectedDevices.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {scanning ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Scan className="w-5 h-5 mr-2" />
          )}
          {scanning ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device List */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Available Devices</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {devices.map(device => (
              <div
                key={device.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDevices.includes(device.id)
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleDeviceSelect(device.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{device.hostname || device.ip}</p>
                    <p className="text-sm text-gray-500">
                      MAC: {device.mac} • Type: {device.type}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    device.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))}
            {devices.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Discovering devices...
              </p>
            )}
          </div>
        </div>

        {/* Scan Status */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Scan Status</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.values(scanStatuses).map(status => (
              <div key={status.deviceId} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">
                    {devices.find(d => d.id === status.deviceId)?.hostname || status.deviceId}
                  </p>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    status.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : status.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {status.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${status.progress}%` }}
                  />
                </div>
                {status.findings.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Findings:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {status.findings.map((finding, index) => (
                        <li key={index}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {Object.keys(scanStatuses).length === 0 && !scanning && (
              <p className="text-gray-500 text-center py-4">
                No scans in progress
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkScanner;
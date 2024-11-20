import React, { useState, useEffect } from 'react';
import { Container, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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

const ContainerScanner = () => {
  const [containers, setContainers] = useState<ContainerScan[]>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      const response = await fetch('/.netlify/functions/containerScan');
      const data = await response.json();
      setContainers(data.containers);
    } catch (error) {
      console.error('Failed to fetch containers:', error);
    }
  };

  const startScan = async () => {
    setScanning(true);
    try {
      await fetch('/.netlify/functions/containerScan', {
        method: 'POST',
        body: JSON.stringify({ containerId: selectedContainer })
      });
      await fetchContainers();
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Container Security Scanner</h2>
        <button
          onClick={startScan}
          disabled={scanning || !selectedContainer}
          className={`btn-primary flex items-center ${
            scanning || !selectedContainer ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {scanning ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Container className="w-5 h-5 mr-2" />
          )}
          {scanning ? 'Scanning...' : 'Scan Selected'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Container List */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Available Containers</h3>
          <div className="space-y-2">
            {containers.map(container => (
              <div
                key={container.id}
                onClick={() => setSelectedContainer(container.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedContainer === container.id
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{container.name}</p>
                    <p className="text-sm text-gray-500">Image: {container.image}</p>
                  </div>
                  {container.status === 'secure' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {container.status === 'warning' && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  {container.status === 'critical' && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scan Results */}
        {selectedContainer && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Scan Results</h3>
            {containers
              .filter(c => c.id === selectedContainer)
              .map(container => (
                <div key={container.id} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">Critical</p>
                      <p className="text-2xl font-bold text-red-700">
                        {container.vulnerabilities.critical}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-700">High</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {container.vulnerabilities.high}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-700">Medium</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {container.vulnerabilities.medium}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">Low</p>
                      <p className="text-2xl font-bold text-green-700">
                        {container.vulnerabilities.low}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Last scanned: {new Date(container.lastScanned).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerScanner;
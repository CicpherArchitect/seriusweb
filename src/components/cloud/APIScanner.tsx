import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

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

const APIScanner = () => {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({ url: '', method: 'GET' });

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      const response = await fetch('/.netlify/functions/apiScan');
      const data = await response.json();
      setEndpoints(data.endpoints);
    } catch (error) {
      console.error('Failed to fetch endpoints:', error);
    }
  };

  const addEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/.netlify/functions/apiScan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEndpoint)
      });
      const data = await response.json();
      setEndpoints(prev => [...prev, data.endpoint]);
      setNewEndpoint({ url: '', method: 'GET' });
    } catch (error) {
      console.error('Failed to add endpoint:', error);
    }
  };

  const startScan = async () => {
    if (!selectedEndpoint) return;

    setScanning(true);
    try {
      const response = await fetch('/.netlify/functions/apiScan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ endpointId: selectedEndpoint, action: 'scan' })
      });

      const data = await response.json();
      setEndpoints(prev =>
        prev.map(e => (e.id === selectedEndpoint ? data.endpoint : e))
      );
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">API Security Scanner</h2>
        <button
          onClick={startScan}
          disabled={scanning || !selectedEndpoint}
          className={`btn-primary flex items-center ${
            scanning || !selectedEndpoint ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {scanning ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Shield className="w-5 h-5 mr-2" />
          )}
          {scanning ? 'Scanning...' : 'Scan Selected'}
        </button>
      </div>

      {/* Add New Endpoint Form */}
      <form onSubmit={addEndpoint} className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint URL
            </label>
            <input
              type="url"
              id="url"
              value={newEndpoint.url}
              onChange={e => setNewEndpoint(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://api.example.com/endpoint"
              required
            />
          </div>
          <div className="w-32">
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
              Method
            </label>
            <select
              id="method"
              value={newEndpoint.method}
              onChange={e => setNewEndpoint(prev => ({ ...prev, method: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-secondary h-10">
              Add Endpoint
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Endpoint List */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
          <div className="space-y-2">
            {endpoints.map(endpoint => (
              <div
                key={endpoint.id}
                onClick={() => setSelectedEndpoint(endpoint.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedEndpoint === endpoint.id
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{endpoint.url}</p>
                    <p className="text-sm text-gray-500">
                      Method: {endpoint.method}
                    </p>
                  </div>
                  {endpoint.status === 'secure' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {endpoint.status === 'warning' && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  {endpoint.status === 'critical' && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
            {endpoints.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No endpoints added yet</p>
                <p className="text-sm mt-1">
                  Add an endpoint to begin scanning
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scan Results */}
        {selectedEndpoint && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Scan Results</h3>
            {endpoints
              .filter(e => e.id === selectedEndpoint)
              .map(endpoint => (
                <div key={endpoint.id} className="space-y-6">
                  {/* Vulnerability Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">Critical</p>
                      <p className="text-2xl font-bold text-red-700">
                        {endpoint.vulnerabilities.critical}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-700">High</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {endpoint.vulnerabilities.high}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Findings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Security Findings</h4>
                    {endpoint.findings.map((finding, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-1 text-sm rounded-full ${
                              finding.severity === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : finding.severity === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : finding.severity === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {finding.severity}
                          </span>
                          <span className="text-sm text-gray-500">
                            {finding.category}
                          </span>
                        </div>
                        <p className="text-gray-700">{finding.description}</p>
                        <p className="text-sm text-indigo-600">
                          Recommendation: {finding.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    Last scanned: {new Date(endpoint.lastScanned).toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default APIScanner;
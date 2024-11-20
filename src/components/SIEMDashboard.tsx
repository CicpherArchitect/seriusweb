import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface SIEMEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
  details: Record<string, any>;
}

const SIEMDashboard: React.FC = () => {
  const [events, setEvents] = useState<SIEMEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forwardToSIEM = async (event: SIEMEvent) => {
    try {
      await fetch('/.netlify/functions/siemIntegration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (err) {
      console.error('Failed to forward event:', err);
      throw err;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Activity className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold">SIEM Integration</h2>
        </div>
        <button
          onClick={() => {}} // Refresh SIEM events
          className="btn-secondary flex items-center"
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5 mr-2" />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Event Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600 font-medium">Critical</p>
            <p className="text-2xl font-bold text-red-700">
              {events.filter(e => e.severity === 'critical').length}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-600 font-medium">High</p>
            <p className="text-2xl font-bold text-orange-700">
              {events.filter(e => e.severity === 'high').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-600 font-medium">Medium</p>
            <p className="text-2xl font-bold text-yellow-700">
              {events.filter(e => e.severity === 'medium').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-600 font-medium">Low</p>
            <p className="text-2xl font-bold text-green-700">
              {events.filter(e => e.severity === 'low').length}
            </p>
          </div>
        </div>

        {/* Event List */}
        <div className="border rounded-lg">
          <div className="px-4 py-3 border-b">
            <h3 className="font-medium">Recent Events</h3>
          </div>
          <div className="divide-y">
            {events.map((event, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      getSeverityColor(event.severity)
                    }`}>
                      {event.severity}
                    </span>
                    <span className="ml-3 font-medium">{event.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Source: {event.source}
                  </p>
                  <pre className="mt-2 text-sm bg-gray-50 p-2 rounded">
                    {JSON.stringify(event.details, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No events to display</p>
                <p className="text-sm mt-1">
                  Events will appear here when detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIEMDashboard;
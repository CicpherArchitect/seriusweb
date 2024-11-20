import React, { useState } from 'react';
import { Activity, Shield, AlertTriangle, Map, User, RefreshCw } from 'lucide-react';

interface AttackTrace {
  entryPoint: {
    type: string;
    details: string;
    timestamp: string;
    confidence: number;
  };
  lateralMovement: {
    path: Array<{
      source: string;
      destination: string;
      timestamp: string;
      technique: string;
    }>;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  origin: {
    ip: string;
    location: string;
    actor?: string;
    confidence: number;
  };
  compromisedAccounts: Array<{
    id: string;
    username: string;
    lastActivity: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    indicators: string[];
  }>;
}

const AttackTracing: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [trace, setTrace] = useState<AttackTrace | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeAttack = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/attackTracing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          incidentId: 'incident123'
        })
      });

      const data = await response.json();
      setTrace(data);
    } catch (err) {
      setError('Failed to analyze attack pattern');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAccountAction = async (accountId: string) => {
    try {
      await fetch('/.netlify/functions/accountManagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          action: 'disable'
        })
      });
      
      // Refresh attack trace
      await analyzeAttack();
    } catch (err) {
      setError('Failed to manage account');
      console.error('Account management error:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Activity className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold">Attack Tracing</h2>
        </div>
        <button
          onClick={analyzeAttack}
          disabled={analyzing}
          className={`btn-primary flex items-center ${analyzing ? 'opacity-50' : ''}`}
        >
          {analyzing ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Activity className="w-5 h-5 mr-2" />
          )}
          {analyzing ? 'Analyzing...' : 'Analyze Attack Pattern'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {trace && (
        <div className="space-y-6">
          {/* Entry Point */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <Shield className="w-5 h-5 text-indigo-500 mr-2" />
              Entry Point
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Type:</span> {trace.entryPoint.type}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Details:</span> {trace.entryPoint.details}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Confidence:</span>{' '}
                {(trace.entryPoint.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Lateral Movement */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <Activity className="w-5 h-5 text-indigo-500 mr-2" />
              Lateral Movement
            </h3>
            <div className="space-y-4">
              {trace.lateralMovement.path.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{step.source}</p>
                    <p className="text-gray-500">{step.technique}</p>
                  </div>
                  <div className="mx-4">→</div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{step.destination}</p>
                    <p className="text-gray-500">
                      {new Date(step.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attack Origin */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <Map className="w-5 h-5 text-indigo-500 mr-2" />
              Attack Origin
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">IP:</span> {trace.origin.ip}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Location:</span> {trace.origin.location}
              </p>
              {trace.origin.actor && (
                <p className="text-gray-700">
                  <span className="font-medium">Suspected Actor:</span> {trace.origin.actor}
                </p>
              )}
              <p className="text-gray-700">
                <span className="font-medium">Confidence:</span>{' '}
                {(trace.origin.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Compromised Accounts */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <User className="w-5 h-5 text-indigo-500 mr-2" />
              Compromised Accounts
            </h3>
            <div className="space-y-4">
              {trace.compromisedAccounts.map((account) => (
                <div key={account.id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium">{account.username}</p>
                      <p className="text-sm text-gray-500">
                        Last Activity: {new Date(account.lastActivity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAccountAction(account.id)}
                      className="btn-secondary text-sm"
                    >
                      Disable Account
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Suspicious Indicators:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {account.indicators.map((indicator, index) => (
                        <li key={index}>{indicator}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttackTracing;
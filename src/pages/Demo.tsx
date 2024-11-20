import React, { useState } from 'react';
import { Shield, AlertTriangle, Activity, FileCheck, Brain } from 'lucide-react';
import AIAnalysisDashboard from '../components/AIAnalysisDashboard';
import AttackTracing from '../components/AttackTracing';
import EvidenceIntegrity from '../components/EvidenceIntegrity';
import MalwareAnalyzer from '../components/MalwareAnalyzer';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('analysis');

  // Mock data for demo
  const mockLogs = [
    {
      timestamp: new Date().toISOString(),
      action: 'FILE_ACCESS',
      details: 'Suspicious file access pattern detected in system32 directory'
    },
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'NETWORK_CONNECTION',
      details: 'Outbound connection to known malicious IP address'
    }
  ];

  const mockIncident = {
    id: 'demo-incident',
    title: 'Demo Security Incident',
    description: 'Suspicious activity detected for demonstration',
    indicators: ['malware.exe', 'suspicious.dll', 'unusual-network-traffic']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Interactive Demo
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-indigo-200">
              Experience the power of Serius.io's digital forensics platform
            </p>
          </div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`${
                activeTab === 'analysis'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Brain className="w-5 h-5 mr-2" />
              AI Analysis
            </button>
            <button
              onClick={() => setActiveTab('tracing')}
              className={`${
                activeTab === 'tracing'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Activity className="w-5 h-5 mr-2" />
              Attack Tracing
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`${
                activeTab === 'evidence'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FileCheck className="w-5 h-5 mr-2" />
              Evidence Integrity
            </button>
            <button
              onClick={() => setActiveTab('malware')}
              className={`${
                activeTab === 'malware'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Shield className="w-5 h-5 mr-2" />
              Malware Analysis
            </button>
          </nav>
        </div>

        {/* Demo Content */}
        <div className="mt-8">
          {activeTab === 'analysis' && (
            <AIAnalysisDashboard
              logs={mockLogs}
              incident={mockIncident}
            />
          )}
          {activeTab === 'tracing' && <AttackTracing />}
          {activeTab === 'evidence' && <EvidenceIntegrity />}
          {activeTab === 'malware' && <MalwareAnalyzer />}
        </div>

        {/* Demo Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Demo Environment</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This is a demonstration environment using simulated data. In a production environment,
                  Serius.io provides real-time analysis and response capabilities with actual security data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
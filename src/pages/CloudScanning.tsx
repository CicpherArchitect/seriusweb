import React, { useState } from 'react';
import { Cloud, Container, Code, Globe, Shield, Brain } from 'lucide-react';
import ContainerScanner from '../components/cloud/ContainerScanner';
import IaCAnalyzer from '../components/cloud/IaCAnalyzer';
import APIScanner from '../components/cloud/APIScanner';
import RemediationDashboard from '../components/cloud/RemediationDashboard';
import AIThreatDefense from '../components/AIThreatDefense';

const CloudScanning = () => {
  const [activeTab, setActiveTab] = useState('containers');

  const tabs = [
    { id: 'containers', label: 'Containers', icon: Container },
    { id: 'iac', label: 'Infrastructure', icon: Code },
    { id: 'apis', label: 'API Security', icon: Globe },
    { id: 'ai_defense', label: 'AI Defense', icon: Brain },
    { id: 'remediation', label: 'Remediation', icon: Shield }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center">
          <Cloud className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Cloud Environment Scanner
          </h1>
        </div>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Scan and secure your cloud infrastructure with AI-powered threat detection and automated remediation.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className={`
                -ml-0.5 mr-2 h-5 w-5
                ${activeTab === id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
              `} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-lg">
        {activeTab === 'containers' && <ContainerScanner />}
        {activeTab === 'iac' && <IaCAnalyzer />}
        {activeTab === 'apis' && <APIScanner />}
        {activeTab === 'ai_defense' && <AIThreatDefense />}
        {activeTab === 'remediation' && <RemediationDashboard />}
      </div>
    </div>
  );
};

export default CloudScanning;
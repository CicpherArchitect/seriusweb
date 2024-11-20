import React from 'react';
import NetworkScanner from '../components/NetworkScanner';
import { Network, Shield, AlertCircle } from 'lucide-react';

const NetworkResponse = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center">
          <Network className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Network-Based Incident Response
          </h1>
        </div>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Instantly respond to security incidents by scanning and analyzing devices across your network.
          No pre-installation required.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-3 text-lg font-medium">Security Status</h3>
          </div>
          <p className="text-sm text-gray-600">
            Network security level: <span className="font-medium text-green-600">Secure</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Last scan: <span className="font-medium">2 hours ago</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Network className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-3 text-lg font-medium">Network Overview</h3>
          </div>
          <p className="text-sm text-gray-600">
            Active devices: <span className="font-medium">24</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Monitored segments: <span className="font-medium">3</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-3 text-lg font-medium">Active Alerts</h3>
          </div>
          <p className="text-sm text-gray-600">
            Critical: <span className="font-medium text-red-600">0</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Warnings: <span className="font-medium text-yellow-600">2</span>
          </p>
        </div>
      </div>

      {/* Network Scanner */}
      <NetworkScanner />
    </div>
  );
};

export default NetworkResponse;
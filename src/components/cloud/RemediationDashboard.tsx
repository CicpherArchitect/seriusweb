import React, { useState } from 'react';
import { Shield, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface RemediationAction {
  id: string;
  type: 'container' | 'iac' | 'api';
  resource: string;
  issue: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  automated: boolean;
}

const RemediationDashboard = () => {
  const [actions, setActions] = useState<RemediationAction[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRemediate = async (actionId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId })
      });
      
      const data = await response.json();
      setActions(prev => 
        prev.map(action => 
          action.id === actionId ? { ...action, status: data.status } : action
        )
      );
    } catch (error) {
      console.error('Remediation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Remediation Dashboard</h2>
        <button
          onClick={() => {}} // Refresh remediation actions
          className="btn-secondary flex items-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-red-700 font-medium">Critical Issues</h3>
            <p className="text-2xl font-bold text-red-700">
              {actions.filter(a => a.severity === 'critical').length}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-orange-700 font-medium">High Priority</h3>
            <p className="text-2xl font-bold text-orange-700">
              {actions.filter(a => a.severity === 'high').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-yellow-700 font-medium">Medium Priority</h3>
            <p className="text-2xl font-bold text-yellow-700">
              {actions.filter(a => a.severity === 'medium').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-green-700 font-medium">Completed</h3>
            <p className="text-2xl font-bold text-green-700">
              {actions.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Remediation Actions */}
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-3 border-b">
            <h3 className="font-medium">Remediation Actions</h3>
          </div>
          <div className="divide-y">
            {actions.map(action => (
              <div key={action.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      {action.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      )}
                      {action.status === 'failed' && (
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      {(action.status === 'pending' || action.status === 'in_progress') && (
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                      )}
                      <span className="font-medium">{action.resource}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{action.issue}</p>
                  </div>
                  <button
                    onClick={() => handleRemediate(action.id)}
                    disabled={loading || action.status === 'completed'}
                    className={`btn-primary flex items-center ${
                      loading || action.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    {action.automated ? 'Auto-Remediate' : 'Manual Fix Required'}
                  </button>
                </div>
                <p className="text-sm text-indigo-600 mt-2">
                  Recommendation: {action.recommendation}
                </p>
              </div>
            ))}
            {actions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No remediation actions required</p>
                <p className="text-sm mt-1">All resources are currently secure</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemediationDashboard;
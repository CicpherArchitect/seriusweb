import React, { useState, useEffect } from 'react';
import { User, Shield, AlertTriangle, Lock, RefreshCw } from 'lucide-react';

interface CompromisedAccount {
  id: string;
  username: string;
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'disabled' | 'locked';
  indicators: string[];
  mitigationSteps: string[];
}

const CompromisedAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<CompromisedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/accountManagement');
      const data = await response.json();
      setAccounts(data.accounts);
    } catch (err) {
      setError('Failed to fetch compromised accounts');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAccountAction = async (accountId: string, action: 'disable' | 'lock') => {
    try {
      const response = await fetch('/.netlify/functions/accountManagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, action })
      });
      
      const data = await response.json();
      setAccounts(prev => 
        prev.map(account => 
          account.id === accountId ? data.account : account
        )
      );
    } catch (err) {
      setError('Failed to manage account');
      console.error('Action error:', err);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <User className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold">Compromised Accounts</h2>
        </div>
        <button
          onClick={fetchAccounts}
          disabled={loading}
          className="btn-secondary flex items-center"
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
        {/* Account Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600 font-medium">Critical Risk</p>
            <p className="text-2xl font-bold text-red-700">
              {accounts.filter(a => a.riskLevel === 'critical').length}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-600 font-medium">High Risk</p>
            <p className="text-2xl font-bold text-orange-700">
              {accounts.filter(a => a.riskLevel === 'high').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-600 font-medium">Medium Risk</p>
            <p className="text-2xl font-bold text-yellow-700">
              {accounts.filter(a => a.riskLevel === 'medium').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-600 font-medium">Low Risk</p>
            <p className="text-2xl font-bold text-green-700">
              {accounts.filter(a => a.riskLevel === 'low').length}
            </p>
          </div>
        </div>

        {/* Account List */}
        <div className="border rounded-lg divide-y">
          {accounts.map(account => (
            <div key={account.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-sm ${
                    getRiskLevelColor(account.riskLevel)
                  }`}>
                    {account.riskLevel}
                  </div>
                  <span className="ml-3 font-medium">{account.username}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAccountAction(account.id, 'disable')}
                    disabled={account.status === 'disabled'}
                    className={`btn-secondary text-sm flex items-center ${
                      account.status === 'disabled' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    {account.status === 'disabled' ? 'Disabled' : 'Disable'}
                  </button>
                  <button
                    onClick={() => handleAccountAction(account.id, 'lock')}
                    disabled={account.status === 'locked'}
                    className={`btn-secondary text-sm flex items-center ${
                      account.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    {account.status === 'locked' ? 'Locked' : 'Lock'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Suspicious Indicators
                  </h4>
                  <ul className="space-y-1">
                    {account.indicators.map((indicator, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Mitigation Steps
                  </h4>
                  <ul className="space-y-1">
                    {account.mitigationSteps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <Shield className="w-4 h-4 text-indigo-500 mr-2 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Last Activity: {new Date(account.lastActivity).toLocaleString()}
              </div>
            </div>
          ))}
          {accounts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No compromised accounts detected</p>
              <p className="text-sm mt-1">
                Account monitoring is active
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompromisedAccounts;
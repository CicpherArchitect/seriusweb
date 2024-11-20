import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Brain } from 'lucide-react';

interface ThreatAnalysis {
  type: 'malware' | 'phishing' | 'api_abuse';
  confidence: number;
  indicators: string[];
  recommendation: string;
}

interface DefenseResponse {
  blocked: boolean;
  analysis: ThreatAnalysis;
  mitigationSteps: string[];
}

const AIThreatDefense: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DefenseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeThreat = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/aiThreatDefense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Mock data for demonstration
          timestamp: new Date().toISOString(),
          source: 'api-endpoint',
          activity: 'suspicious_requests'
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to analyze threat');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Brain className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold">AI Threat Defense</h2>
        </div>
        <button
          onClick={analyzeThreat}
          disabled={analyzing}
          className={`btn-primary flex items-center ${analyzing ? 'opacity-50' : ''}`}
        >
          {analyzing ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Shield className="w-5 h-5 mr-2" />
          )}
          {analyzing ? 'Analyzing...' : 'Analyze Threats'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Threat Status */}
          <div className={`p-4 rounded-lg ${
            result.blocked ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className="flex items-center">
              {result.blocked ? (
                <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              )}
              <div>
                <h3 className={`font-medium ${
                  result.blocked ? 'text-red-700' : 'text-green-700'
                }`}>
                  {result.blocked ? 'Threat Blocked' : 'No Active Threats'}
                </h3>
                <p className="text-sm text-gray-600">
                  Confidence: {(result.analysis.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Threat Indicators</h3>
              <ul className="space-y-2">
                {result.analysis.indicators.map((indicator, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Mitigation Steps</h3>
              <ul className="space-y-2">
                {result.mitigationSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <Shield className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-indigo-700 mb-2">Recommendation</h3>
            <p className="text-indigo-600">{result.analysis.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIThreatDefense;
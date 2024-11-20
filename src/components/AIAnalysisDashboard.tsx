import React, { useState } from 'react';
import { Brain, AlertTriangle, Target, TrendingUp } from 'lucide-react';

interface AIAnalysisProps {
  logs: any[];
  incident: any;
}

const AIAnalysisDashboard: React.FC<AIAnalysisProps> = ({ logs, incident }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      // Run all analyses in parallel
      const [anomalyRes, iocRes, predictionRes] = await Promise.all([
        fetch('/.netlify/functions/anomalyDetection', {
          method: 'POST',
          body: JSON.stringify({ logs })
        }),
        fetch('/.netlify/functions/iocCorrelation', {
          method: 'POST',
          body: JSON.stringify({ incident })
        }),
        fetch('/.netlify/functions/predictiveAnalysis', {
          method: 'POST',
          body: JSON.stringify({ incident })
        })
      ]);

      const [anomalies, correlations, predictions] = await Promise.all([
        anomalyRes.json(),
        iocRes.json(),
        predictionRes.json()
      ]);

      setResults({ anomalies, correlations, predictions });
    } catch (err) {
      setError('Failed to complete analysis');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">AI Analysis Dashboard</h2>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className={`btn-primary flex items-center ${loading ? 'opacity-50' : ''}`}
        >
          <Brain className="w-5 h-5 mr-2" />
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Anomaly Detection */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium">Anomalies</h3>
            </div>
            <div className="space-y-2">
              {results.anomalies.findings.map((finding: any, index: number) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  {finding.description}
                </div>
              ))}
            </div>
          </div>

          {/* IOC Correlation */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium">Threat Intel</h3>
            </div>
            <div className="space-y-2">
              {results.correlations.matches.map((match: any, index: number) => (
                <div key={index} className="text-sm">
                  <div className="font-medium">{match.actor}</div>
                  <div className="text-gray-600">
                    Confidence: {(match.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Analysis */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-lg font-medium">Predictions</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">Risk Score</div>
                <div className="text-xl font-bold text-indigo-600">
                  {(results.predictions.riskScore * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-sm mt-4">
                <div className="font-medium mb-2">Recommended Actions:</div>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {results.predictions.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisDashboard;
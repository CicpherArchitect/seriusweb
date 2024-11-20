import { useState } from 'react';

interface AIAnalysisHookResult {
  loading: boolean;
  error: string | null;
  detectAnomalies: (logs: any[]) => Promise<void>;
  correlateIOCs: (incident: any) => Promise<void>;
  predictThreatMitigation: (history: any) => Promise<void>;
  results: {
    anomalies: any[] | null;
    correlations: any[] | null;
    predictions: any | null;
  };
}

export const useAIAnalysis = (): AIAnalysisHookResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState({
    anomalies: null,
    correlations: null,
    predictions: null
  });

  const detectAnomalies = async (logs: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/.netlify/functions/anomalyDetection', {
        method: 'POST',
        body: JSON.stringify(logs)
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, anomalies: data.anomalies }));
    } catch (err) {
      setError('Failed to detect anomalies');
    } finally {
      setLoading(false);
    }
  };

  const correlateIOCs = async (incident: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/.netlify/functions/iocCorrelation', {
        method: 'POST',
        body: JSON.stringify(incident)
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, correlations: data.correlations }));
    } catch (err) {
      setError('Failed to correlate IOCs');
    } finally {
      setLoading(false);
    }
  };

  const predictThreatMitigation = async (history: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/.netlify/functions/predictiveAnalysis', {
        method: 'POST',
        body: JSON.stringify(history)
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, predictions: data.prediction }));
    } catch (err) {
      setError('Failed to generate predictions');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    detectAnomalies,
    correlateIOCs,
    predictThreatMitigation,
    results
  };
};
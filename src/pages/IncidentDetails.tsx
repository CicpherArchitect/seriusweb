import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AIAnalysisDashboard from '../components/AIAnalysisDashboard';
import AttackTracing from '../components/AttackTracing';
import EvidenceIntegrity from '../components/EvidenceIntegrity';

const IncidentDetails = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState({ incidents: [] });

  useEffect(() => {
    // Fetch incident details, logs, and history
    const fetchData = async () => {
      // Mock data for demonstration
      setIncident({
        id,
        title: 'Security Incident',
        description: 'Suspicious activity detected',
        indicators: ['malware.exe', 'suspicious.dll']
      });
      
      setLogs([
        {
          timestamp: new Date().toISOString(),
          action: 'FILE_ACCESS',
          userId: 'user123',
          details: 'Suspicious file access detected'
        }
      ]);
      
      setHistory({
        incidents: [
          {
            severity: 'high',
            resolution: 'Blocked malicious IP',
            timeToResolve: 24,
            techniques: ['T1059', 'T1003']
          }
        ]
      });
    };

    fetchData();
  }, [id]);

  if (!incident) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Incident Details
      </h1>
      
      <div className="space-y-8">
        {/* Incident Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {incident.title}
          </h2>
          <p className="text-gray-600">
            {incident.description}
          </p>
        </div>

        {/* Attack Tracing */}
        <AttackTracing />

        {/* AI Analysis Dashboard */}
        <AIAnalysisDashboard
          incidentId={id!}
          logs={logs}
          incident={incident}
          history={history}
        />

        {/* Evidence Integrity */}
        <EvidenceIntegrity />
      </div>
    </div>
  );
};

export default IncidentDetails;
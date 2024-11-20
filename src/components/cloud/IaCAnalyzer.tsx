import React, { useState } from 'react';
import { Code, AlertTriangle, CheckCircle, Upload, RefreshCw } from 'lucide-react';

interface IaCTemplate {
  id: string;
  name: string;
  type: 'terraform' | 'cloudformation' | 'kubernetes';
  status: 'secure' | 'warning' | 'critical';
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastScanned: string;
  findings: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    rule: string;
    description: string;
    recommendation: string;
  }[];
}

const IaCAnalyzer = () => {
  const [templates, setTemplates] = useState<IaCTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('template', files[0]);

      const response = await fetch('/.netlify/functions/iacAnalyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setTemplates(prev => [...prev, data.template]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const startScan = async () => {
    if (!selectedTemplate) return;

    setScanning(true);
    try {
      const response = await fetch('/.netlify/functions/iacAnalyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ templateId: selectedTemplate })
      });

      const data = await response.json();
      setTemplates(prev =>
        prev.map(t => (t.id === selectedTemplate ? data.template : t))
      );
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Infrastructure as Code Analyzer</h2>
        <div className="flex space-x-4">
          <label className="btn-secondary flex items-center cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            Upload Template
            <input
              type="file"
              className="hidden"
              accept=".tf,.yml,.yaml,.json"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <button
            onClick={startScan}
            disabled={scanning || !selectedTemplate}
            className={`btn-primary flex items-center ${
              scanning || !selectedTemplate ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {scanning ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Code className="w-5 h-5 mr-2" />
            )}
            {scanning ? 'Scanning...' : 'Scan Selected'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template List */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Infrastructure Templates</h3>
          <div className="space-y-2">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-gray-500">Type: {template.type}</p>
                  </div>
                  {template.status === 'secure' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {template.status === 'warning' && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  {template.status === 'critical' && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No templates uploaded yet</p>
                <p className="text-sm mt-1">
                  Upload a template to begin analysis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {selectedTemplate && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
            {templates
              .filter(t => t.id === selectedTemplate)
              .map(template => (
                <div key={template.id} className="space-y-6">
                  {/* Issue Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">Critical Issues</p>
                      <p className="text-2xl font-bold text-red-700">
                        {template.issues.critical}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-700">High Risk</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {template.issues.high}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Findings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Findings</h4>
                    {template.findings.map((finding, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-1 text-sm rounded-full ${
                              finding.severity === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : finding.severity === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : finding.severity === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {finding.severity}
                          </span>
                          <span className="text-sm text-gray-500">
                            {finding.rule}
                          </span>
                        </div>
                        <p className="text-gray-700">{finding.description}</p>
                        <p className="text-sm text-indigo-600">
                          Recommendation: {finding.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    Last scanned: {new Date(template.lastScanned).toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IaCAnalyzer;
import React, { useState } from 'react';
import { FileCheck, Shield, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface EvidenceVerification {
  id: string;
  hash: string;
  timestamp: string;
  blockNumber: number;
  transactionHash: string;
  verified: boolean;
}

const EvidenceIntegrity: React.FC = () => {
  const [verifying, setVerifying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verification, setVerification] = useState<EvidenceVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      setSelectedFile(files[0]);
      setVerification(null);
      setError(null);
    }
  };

  const verifyEvidence = async () => {
    if (!selectedFile) return;

    setVerifying(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/.netlify/functions/verifyEvidence', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setVerification(data);
    } catch (err) {
      setError('Failed to verify evidence');
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold">Evidence Integrity Verification</h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
              >
                <span>Upload evidence file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Verify Button */}
        <div className="flex justify-center">
          <button
            onClick={verifyEvidence}
            disabled={!selectedFile || verifying}
            className={`btn-primary flex items-center ${
              !selectedFile || verifying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {verifying ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Shield className="w-5 h-5 mr-2" />
            )}
            {verifying ? 'Verifying...' : 'Verify Integrity'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Verification Results */}
        {verification && (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${
              verification.verified ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center">
                {verification.verified ? (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                )}
                <div>
                  <h3 className={`font-medium ${
                    verification.verified ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {verification.verified ? 'Evidence Verified' : 'Verification Failed'}
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Evidence Details</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Hash</dt>
                    <dd className="text-sm font-mono break-all">{verification.hash}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Timestamp</dt>
                    <dd className="text-sm">
                      {new Date(verification.timestamp).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Blockchain Record</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Block Number</dt>
                    <dd className="text-sm font-mono">{verification.blockNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Transaction Hash</dt>
                    <dd className="text-sm font-mono break-all">
                      {verification.transactionHash}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceIntegrity;
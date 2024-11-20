import React from 'react';
import {
  Shield,
  Search,
  Clock,
  Brain,
  Lock,
  FileDigit,
  Fingerprint,
  History,
  Network,
  AlertCircle,
  FileCheck,
  Workflow,
  Microscope,
  BookOpen,
  Blocks,
  Siren
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Military-Grade Security',
    description: [
      'AES-256 encryption for files at rest',
      'Immutable S3 storage with retention policies',
      'Blockchain-based evidence integrity verification',
      'Role-based access control (RBAC)'
    ]
  },
  {
    icon: Search,
    title: 'Advanced Threat Detection',
    description: [
      'Real-time malware scanning using ClamAV',
      'Automated threat pattern recognition',
      'Integration with threat intelligence feeds',
      'Behavioral analysis of suspicious files'
    ]
  },
  {
    icon: FileDigit,
    title: 'Evidence Management',
    description: [
      'Secure file upload with integrity checks',
      'Automated chain of custody tracking',
      'Court-admissible evidence handling',
      'Comprehensive metadata extraction'
    ]
  },
  {
    icon: History,
    title: 'Audit Trail & Logging',
    description: [
      'Immutable audit logs for all actions',
      'Detailed user activity tracking',
      'Automated log rotation and retention',
      'Compliance-ready reporting'
    ]
  },
  {
    icon: Network,
    title: 'Real-Time Collaboration',
    description: [
      'WebSocket-based live updates',
      'Team collaboration features',
      'Incident response coordination',
      'Secure information sharing'
    ]
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: [
      'Pattern recognition in evidence',
      'Automated incident correlation',
      'Predictive threat analysis',
      'Machine learning insights'
    ]
  },
  {
    icon: Blocks,
    title: 'Blockchain Integration',
    description: [
      'Evidence anchoring on Ethereum',
      'Immutable timestamp verification',
      'Cryptographic proof of existence',
      'Distributed integrity validation'
    ]
  },
  {
    icon: Workflow,
    title: 'Automated Workflows',
    description: [
      'Customizable incident response playbooks',
      'Automated evidence processing',
      'Integration with security tools',
      'Streamlined investigation processes'
    ]
  },
  {
    icon: AlertCircle,
    title: 'Incident Response',
    description: [
      'Structured incident management',
      'Severity-based prioritization',
      'Automated alerting system',
      'Response time tracking'
    ]
  },
  {
    icon: FileCheck,
    title: 'Compliance & Reporting',
    description: [
      'GDPR, HIPAA, SOC2 compliance',
      'Customizable report templates',
      'Automated compliance checks',
      'Evidence preservation policies'
    ]
  },
  {
    icon: Microscope,
    title: 'Forensic Analysis',
    description: [
      'Deep file analysis capabilities',
      'Metadata extraction and indexing',
      'Timeline reconstruction',
      'Pattern matching across evidence'
    ]
  },
  {
    icon: BookOpen,
    title: 'Documentation & API',
    description: [
      'Comprehensive API documentation',
      'Interactive Swagger interface',
      'SDK and integration guides',
      'Best practices documentation'
    ]
  }
];

const Features = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-indigo-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Powerful Features for Digital Forensics
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-indigo-200">
              Advanced tools and capabilities for professional digital forensics and incident response
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h2 className="text-lg font-medium text-gray-900">{feature.title}</h2>
                  <ul className="mt-2 text-base text-gray-500 space-y-2">
                    {feature.description.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-600">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
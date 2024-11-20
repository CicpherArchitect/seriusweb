import { Handler } from '@netlify/functions';
import natural from 'natural';
import fetch from 'node-fetch';

interface Incident {
  id: string;
  title: string;
  description: string;
  indicators: string[];
}

interface ThreatActor {
  name: string;
  indicators: string[];
  techniques: string[];
  confidence: number;
}

// Mock threat intelligence database
const mockThreatDB: ThreatActor[] = [
  {
    name: 'APT29',
    indicators: ['powershell.exe', 'mimikatz', 'cobalt strike'],
    techniques: ['T1059.001', 'T1003', 'T1088'],
    confidence: 0.85
  },
  {
    name: 'APT28',
    indicators: ['x-agent', 'komplex', 'sofacy'],
    techniques: ['T1091', 'T1027', 'T1064'],
    confidence: 0.78
  }
];

const correlateIOCs = async (incident: Incident) => {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  // Add incident data to TF-IDF
  tfidf.addDocument([
    incident.title,
    incident.description,
    ...incident.indicators
  ].join(' '));

  // Add threat actor data
  mockThreatDB.forEach(actor => {
    tfidf.addDocument([
      actor.name,
      ...actor.indicators,
      ...actor.techniques
    ].join(' '));
  });

  // Calculate similarity scores
  const matches = mockThreatDB.map(actor => {
    let score = 0;
    tfidf.tfidfs(incident.indicators.join(' '), (i, measure) => {
      if (i > 0) score += measure;
    });

    return {
      actor: actor.name,
      score: score * actor.confidence,
      matchedIndicators: actor.indicators.filter(ioc => 
        incident.indicators.some(incidentIoc => 
          incidentIoc.toLowerCase().includes(ioc.toLowerCase())
        )
      ),
      suggestedTechniques: actor.techniques,
      confidence: actor.confidence
    };
  });

  // Sort by score and filter out low-confidence matches
  const significantMatches = matches
    .filter(match => match.score > 0.1)
    .sort((a, b) => b.score - a.score);

  return {
    matches: significantMatches,
    recommendedActions: significantMatches.length > 0 
      ? [
          'Implement detection rules for matched TTPs',
          'Update security controls based on threat actor techniques',
          'Monitor for additional indicators associated with identified actors'
        ]
      : ['Continue monitoring for known indicators', 'Expand logging coverage']
  };
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const incident = JSON.parse(event.body || '{}');
    const results = await correlateIOCs(incident);

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('IOC correlation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
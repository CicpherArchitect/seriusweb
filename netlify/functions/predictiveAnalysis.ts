import { Handler } from '@netlify/functions';
import * as tf from '@tensorflow/tfjs-node';
import natural from 'natural';

interface IncidentHistory {
  incidents: {
    severity: string;
    resolution: string;
    timeToResolve: number;
    techniques: string[];
  }[];
}

const severityMap = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3
};

const predictMitigation = async (history: IncidentHistory) => {
  // Convert categorical data to numerical
  const features = history.incidents.map(incident => [
    severityMap[incident.severity as keyof typeof severityMap],
    incident.timeToResolve,
    incident.techniques.length
  ]);

  // Create and train a simple neural network
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 4, activation: 'softmax' })
    ]
  });

  const xs = tf.tensor2d(features);
  const ys = tf.tensor2d(features.map(f => [f[0] / 3])); // Normalize severity

  await model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError',
    metrics: ['accuracy']
  });

  await model.fit(xs, ys, {
    epochs: 100,
    verbose: 0
  });

  // Analyze patterns in techniques
  const techniquePatterns = history.incidents.reduce((acc, incident) => {
    incident.techniques.forEach(technique => {
      acc[technique] = (acc[technique] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const commonTechniques = Object.entries(techniquePatterns)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([technique]) => technique);

  // Generate risk score and predictions
  const latestIncident = history.incidents[history.incidents.length - 1];
  const prediction = await model.predict(tf.tensor2d([[
    severityMap[latestIncident.severity as keyof typeof severityMap],
    latestIncident.timeToResolve,
    latestIncident.techniques.length
  ]])).data();

  return {
    riskScore: prediction[0],
    commonTechniques,
    recommendations: [
      'Implement detection rules for most common attack techniques',
      'Update incident response playbooks based on historical patterns',
      'Focus security training on frequently observed attack vectors',
      'Enhance monitoring for predicted high-risk areas'
    ],
    predictedTimeToResolve: Math.round(latestIncident.timeToResolve * prediction[0]),
    confidence: 0.85
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
    const history = JSON.parse(event.body || '{}');
    const results = await predictMitigation(history);

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Predictive analysis error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
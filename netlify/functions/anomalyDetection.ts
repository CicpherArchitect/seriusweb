import { Handler } from '@netlify/functions';
import * as tf from '@tensorflow/tfjs';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();

interface LogEntry {
  timestamp: string;
  action: string;
  details: string;
}

const detectAnomalies = async (logs: LogEntry[]) => {
  // Convert logs to numerical features
  const features = logs.map(log => {
    const tokens = tokenizer.tokenize(log.details.toLowerCase());
    const uniqueTokens = new Set(tokens);
    
    return {
      timestamp: new Date(log.timestamp).getTime(),
      tokenCount: tokens.length,
      uniqueTokens: uniqueTokens.size
    };
  });

  // Create and train a simple autoencoder for anomaly detection
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    inputShape: [3],
    units: 2,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 3,
    activation: 'sigmoid'
  }));

  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError'
  });

  // Convert features to tensor
  const inputData = tf.tensor2d(
    features.map(f => [f.timestamp, f.tokenCount, f.uniqueTokens])
  );

  // Train the model
  await model.fit(inputData, inputData, {
    epochs: 50,
    verbose: 0
  });

  // Get reconstruction error
  const predicted = model.predict(inputData) as tf.Tensor;
  const reconstructionError = tf.sub(inputData, predicted).abs().mean(1);
  const errors = await reconstructionError.array();

  // Find anomalies (entries with high reconstruction error)
  const threshold = tf.mean(reconstructionError).arraySync() as number + 
                   tf.moments(reconstructionError).variance.arraySync() as number;

  const anomalies = logs.filter((_, i) => errors[i] > threshold);

  return {
    findings: anomalies.map(log => ({
      timestamp: log.timestamp,
      description: `Anomalous activity detected: ${log.details}`,
      confidence: errors[logs.indexOf(log)]
    })),
    metadata: {
      totalLogs: logs.length,
      anomalyCount: anomalies.length,
      threshold
    }
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
    const { logs } = JSON.parse(event.body || '{}');
    const results = await detectAnomalies(logs);

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Anomaly detection error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
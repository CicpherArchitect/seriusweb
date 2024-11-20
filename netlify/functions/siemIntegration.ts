import { Handler } from '@netlify/functions';
import winston from 'winston';
import SplunkLogger from 'splunk-logging';

interface SIEMEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
  details: Record<string, any>;
}

// Configure SIEM loggers
const configureSplunk = () => {
  const config = {
    token: process.env.SPLUNK_TOKEN,
    url: process.env.SPLUNK_URL
  };

  return new SplunkLogger(config);
};

const splunkLogger = configureSplunk();

const forwardToSIEM = async (event: SIEMEvent) => {
  return new Promise((resolve, reject) => {
    splunkLogger.send({
      message: {
        ...event,
        source: 'serius-io',
        sourcetype: 'serius:security'
      },
      severity: event.severity,
      timestamp: new Date(event.timestamp).getTime()
    }, (err, resp, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const siemEvent: SIEMEvent = JSON.parse(event.body || '{}');
    await forwardToSIEM(siemEvent);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Event forwarded to SIEM successfully'
      })
    };
  } catch (error) {
    console.error('SIEM integration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to forward event to SIEM' })
    };
  }
};
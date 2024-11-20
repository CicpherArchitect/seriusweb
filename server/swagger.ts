import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const doc = {
  info: {
    title: 'Serius.io API Documentation',
    description: 'API documentation for the Serius.io digital forensics platform'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer token authentication'
    },
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key',
      description: 'API key authentication'
    }
  }
};

export const setupSwagger = (app: Express) => {
  swaggerAutogen('./swagger.json')([], doc);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(doc));
};
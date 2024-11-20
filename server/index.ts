import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { incidentRouter } from './routes/incident.routes.js';
import { evidenceRouter } from './routes/evidence.routes.js';
import { WebSocketManager } from './lib/websocket.js';
import { setupSwagger } from './swagger.js';

config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

export const wsManager = new WebSocketManager(server);

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/incidents', incidentRouter);
app.use('/api/evidence', evidenceRouter);

app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
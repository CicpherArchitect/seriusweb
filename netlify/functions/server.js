import express from 'express';
import cors from 'cors';
import { handler as authHandler } from './auth.js';

const app = express();
const port = process.env.PORT || 9999;

app.use(cors());
app.use(express.json());

// Route handler for authentication
app.post('/auth', async (req, res) => {
  const result = await authHandler({
    httpMethod: 'POST',
    body: JSON.stringify(req.body),
    headers: req.headers
  });
  
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.listen(port, () => {
  console.log(`Local development server running at http://localhost:${port}`);
});
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiKeyAuth } from '../middleware/apiKey.js';
import {
  getUploadUrl,
  confirmUpload,
  getDownloadUrl,
  getEvidenceById,
  getEvidencesByIncident,
  deleteEvidence
} from '../controllers/evidence.controller.js';
import { validateSchema } from '../middleware/validateSchema.js';
import { evidenceSchema, uploadUrlSchema, confirmUploadSchema } from '../schemas/evidence.schema.js';

export const evidenceRouter = Router();

// Support both JWT and API key authentication
evidenceRouter.use((req, res, next) => {
  if (req.headers['x-api-key']) {
    return apiKeyAuth(req, res, next);
  }
  authenticate(req, res, next);
});

evidenceRouter.post('/upload-url', authorize('analyst', 'admin'), validateSchema(uploadUrlSchema), getUploadUrl);
evidenceRouter.post('/confirm-upload', authorize('analyst', 'admin'), validateSchema(confirmUploadSchema), confirmUpload);
evidenceRouter.get('/download/:id', getDownloadUrl);
evidenceRouter.get('/:id', getEvidenceById);
evidenceRouter.get('/incident/:incidentId', getEvidencesByIncident);
evidenceRouter.delete('/:id', authorize('admin'), deleteEvidence);
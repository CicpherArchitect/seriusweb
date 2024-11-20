import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident
} from '../controllers/incident.controller.js';
import { validateSchema } from '../middleware/validateSchema.js';
import { incidentSchema } from '../schemas/incident.schema.js';

export const incidentRouter = Router();

incidentRouter.use(authenticate);

incidentRouter.post('/', authorize('analyst', 'admin'), validateSchema(incidentSchema), createIncident);
incidentRouter.get('/', getIncidents);
incidentRouter.get('/:id', getIncidentById);
incidentRouter.put('/:id', authorize('analyst', 'admin'), validateSchema(incidentSchema), updateIncident);
incidentRouter.delete('/:id', authorize('admin'), deleteIncident);
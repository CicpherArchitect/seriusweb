import { z } from 'zod';

export const incidentSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'investigating', 'resolved', 'closed']),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()).optional(),
  evidenceIds: z.array(z.string()).optional()
});
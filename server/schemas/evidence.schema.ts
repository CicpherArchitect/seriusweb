import { z } from 'zod';

export const uploadUrlSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  incidentId: z.string()
});

export const confirmUploadSchema = z.object({
  evidenceId: z.string(),
  fileSize: z.number(),
  hash: z.string()
});

export const evidenceSchema = z.object({
  filename: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  hash: z.string(),
  incidentId: z.string(),
  metadata: z.string().optional()
});
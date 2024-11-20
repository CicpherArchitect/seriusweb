import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { statements } from '../lib/db.js';
import { generatePresignedUploadUrl, generatePresignedDownloadUrl } from '../lib/s3.js';
import { encryptFile, decryptFile } from '../lib/encryption.js';
import { scanFile } from '../lib/virusScanner.js';
import { anchorToBlockchain } from '../lib/blockchain.js';
import { logAudit } from '../lib/logger.js';
import { randomUUID } from 'crypto';

export const getUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename, contentType, incidentId } = req.body;

    const { url, key } = await generatePresignedUploadUrl(filename, contentType);
    const evidenceId = randomUUID();

    statements.createEvidence.run(
      evidenceId,
      filename,
      contentType,
      0,
      '',
      key,
      req.user!.userId,
      incidentId,
      JSON.stringify({})
    );

    await logAudit({
      action: 'GENERATE_UPLOAD_URL',
      entityType: 'evidence',
      entityId: evidenceId,
      userId: req.user!.userId,
      details: `Generated upload URL for file: ${filename}`,
      req,
      evidenceId
    });

    res.json({
      status: 'success',
      data: { uploadUrl: url, evidenceId }
    });
  } catch (error) {
    next(error);
  }
};

export const confirmUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { evidenceId, fileSize, hash } = req.body;

    const evidence = statements.getEvidenceById.get(evidenceId);
    if (!evidence) {
      throw new AppError('Evidence not found', 404);
    }

    // Scan file for viruses
    const isClean = await scanFile(Buffer.from(hash));
    if (!isClean) {
      throw new AppError('File contains malware', 400);
    }

    // Encrypt file
    const encryptedHash = encryptFile(Buffer.from(hash)).toString('base64');

    // Anchor hash to blockchain
    const txHash = await anchorToBlockchain(hash);

    // Update evidence record
    statements.updateEvidence.run(
      fileSize,
      encryptedHash,
      txHash,
      evidenceId
    );

    await logAudit({
      action: 'CONFIRM_UPLOAD',
      entityType: 'evidence',
      entityId: evidenceId,
      userId: req.user!.userId,
      details: `Confirmed upload of evidence. Transaction hash: ${txHash}`,
      req,
      evidenceId
    });

    const updatedEvidence = statements.getEvidenceById.get(evidenceId);

    res.json({
      status: 'success',
      data: updatedEvidence
    });
  } catch (error) {
    next(error);
  }
};

// Rest of the controller methods remain the same...
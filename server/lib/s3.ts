import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
  endpoint: `https://${process.env.S3_ENDPOINT}`,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!
  }
});

export const generatePresignedUploadUrl = async (
  filename: string,
  contentType: string
): Promise<{ url: string; key: string }> => {
  const key = `${crypto.randomBytes(16).toString('hex')}-${filename}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    // Enable server-side encryption
    ServerSideEncryption: 'AES256',
    // Set object lock retention
    ObjectLockMode: 'GOVERNANCE',
    ObjectLockRetainUntilDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year retention
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { url, key };
};

export const generatePresignedDownloadUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
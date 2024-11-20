import crypto from 'crypto';

// Since we can't use ClamAV in WebContainer, we'll implement a basic hash check
const KNOWN_MALWARE_HASHES = new Set([
  // Add known malware hashes here
]);

export const scanFile = async (buffer: Buffer): Promise<boolean> => {
  try {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return !KNOWN_MALWARE_HASHES.has(hash);
  } catch (error) {
    console.error('File scan failed:', error);
    return false;
  }
};
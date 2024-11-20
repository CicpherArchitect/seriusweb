import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-encryption-key';

export const encryptFile = (buffer: Buffer): Buffer => {
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  const encrypted = CryptoJS.AES.encrypt(wordArray, ENCRYPTION_KEY);
  return Buffer.from(encrypted.toString());
};

export const decryptFile = (encryptedBuffer: Buffer): Buffer => {
  const encrypted = encryptedBuffer.toString();
  const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  return Buffer.from(decrypted.toString(CryptoJS.enc.Utf8), 'utf8');
};
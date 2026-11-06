import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const secret = process.env.AI_ENCRYPTION_KEY || process.env.JWT_SECRET || 'valora_healthcare_secure_master_ai_key_2026';
  // Derive a deterministic 32-byte key using SHA-256
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypt a plain string (e.g. OpenRouter API key) using AES-256-GCM.
 * Stored in MySQL as format: "iv:tag:ciphertext" (in hex).
 */
export function encryptApiKey(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt an AES-256-GCM encrypted string.
 */
export function decryptApiKey(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      // In case legacy or unencrypted plain text was stored
      return encryptedText;
    }

    const [ivHex, tagHex, cipherHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[CryptoService] Decryption failed:', err);
    return '';
  }
}

/**
 * Mask an API key so it can be safely displayed in the UI without exposing the secret.
 * Example: "sk-or-v1-a1b2c3d4e5f6...7890" -> "sk-or-v1-••••••••••••••••7890"
 */
export function maskApiKey(key: string): string {
  if (!key) return '';
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '••••••••';
  const prefix = trimmed.slice(0, Math.min(8, trimmed.length - 4));
  const suffix = trimmed.slice(-4);
  return `${prefix}${'•'.repeat(16)}${suffix}`;
}

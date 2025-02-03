import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export interface EncryptionKey {
    key: Buffer;
    iv: Buffer;
}

export class EncryptionService {
    private algorithm = 'aes-256-gcm';

    generateKey(): EncryptionKey {
        return {
            key: randomBytes(32), // 256 bits for AES-256
            iv: randomBytes(16)   // 128 bits for IV
        };
    }

    async encryptDocument(data: Buffer, key: EncryptionKey): Promise<Buffer> {
        const cipher = createCipheriv(this.algorithm, key.key, key.iv);
        const encryptedData = Buffer.concat([
            cipher.update(data),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();
        
        // Combine IV, encrypted data, and auth tag
        return Buffer.concat([key.iv, authTag, encryptedData]);
    }

    async decryptDocument(
        encryptedData: Buffer,
        key: EncryptionKey
    ): Promise<Buffer> {
        const decipher = createDecipheriv(this.algorithm, key.key, key.iv);
        const authTag = encryptedData.slice(16, 32);
        const data = encryptedData.slice(32);
        
        decipher.setAuthTag(authTag);
        return Buffer.concat([
            decipher.update(data),
            decipher.final()
        ]);
    }
}

export function encrypt(data: string, key: Buffer): { encrypted: Buffer; iv: Buffer; authTag: Buffer } {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    
    const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final()
    ]);

    return {
        encrypted,
        iv,
        authTag: cipher.getAuthTag()
    };
}

export function decrypt(encrypted: Buffer, key: Buffer, iv: Buffer, authTag: Buffer): string {
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]).toString('utf8');
} 
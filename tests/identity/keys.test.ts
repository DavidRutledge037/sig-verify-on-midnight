import { describe, it, expect } from 'vitest';
import { KeyManager } from '../../src/identity/keys';
import { TextEncoder } from 'util';

describe('KeyManager', () => {
    const keyManager = new KeyManager();

    it('should generate valid Ed25519 key pairs', async () => {
        const keyPair = await keyManager.generateKeyPair();

        // Check key formats
        expect(keyPair.publicKey).toMatch(/^z[1-9A-HJ-NP-Za-km-z]+$/);
        expect(keyPair.privateKey).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
    });

    it('should sign and verify messages', async () => {
        const keyPair = await keyManager.generateKeyPair();
        const message = new TextEncoder().encode('test message');

        // Sign the message
        const signature = await keyManager.sign(message, keyPair.privateKey);

        // Verify the signature
        const isValid = await keyManager.verify(
            message,
            signature,
            keyPair.publicKey
        );

        expect(isValid).toBe(true);
    });

    it('should reject invalid signatures', async () => {
        const keyPair = await keyManager.generateKeyPair();
        const message = new TextEncoder().encode('test message');
        const wrongMessage = new TextEncoder().encode('wrong message');

        const signature = await keyManager.sign(message, keyPair.privateKey);
        const isValid = await keyManager.verify(
            wrongMessage,
            signature,
            keyPair.publicKey
        );

        expect(isValid).toBe(false);
    });
}); 
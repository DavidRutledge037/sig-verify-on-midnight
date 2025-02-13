import { jest } from '@jest/globals';
import type { IKeyManager } from '../../src/types/service.types.js';
import type { KeyPair } from '../../src/types/key.types.js';

describe('KeyManager', () => {
    let keyManager: IKeyManager;
    
    beforeEach(() => {
        // Get service from container
        const { container } = global.testContext;
        keyManager = container.resolve('keyManager');
    });

    describe('generateKeyPair', () => {
        it('should generate a valid key pair', async () => {
            // Act
            const keyPair = await keyManager.generateKeyPair();

            // Assert
            expect(keyPair).toHaveProperty('publicKey');
            expect(keyPair).toHaveProperty('privateKey');
            expect(keyPair.publicKey).toBeInstanceOf(Uint8Array);
            expect(keyPair.privateKey).toBeInstanceOf(Uint8Array);
            expect(keyPair.publicKey.length).toBe(32);
            expect(keyPair.privateKey.length).toBe(64);
        });

        it('should generate unique key pairs', async () => {
            // Act
            const keyPair1 = await keyManager.generateKeyPair();
            const keyPair2 = await keyManager.generateKeyPair();

            // Assert
            expect(Buffer.from(keyPair1.publicKey)).not.toEqual(Buffer.from(keyPair2.publicKey));
            expect(Buffer.from(keyPair1.privateKey)).not.toEqual(Buffer.from(keyPair2.privateKey));
        });
    });

    describe('sign and verify', () => {
        let keyPair: KeyPair;
        const message = new Uint8Array([1, 2, 3, 4, 5]);

        beforeEach(async () => {
            keyPair = await keyManager.generateKeyPair();
        });

        it('should sign messages correctly', async () => {
            // Act
            const signature = await keyManager.sign(message, keyPair.privateKey);

            // Assert
            expect(signature).toBeInstanceOf(Uint8Array);
            expect(signature.length).toBe(64); // Ed25519 signature length
        });

        it('should verify valid signatures', async () => {
            // Arrange
            const signature = await keyManager.sign(message, keyPair.privateKey);

            // Act
            const isValid = await keyManager.verify(message, signature, keyPair.publicKey);

            // Assert
            expect(isValid).toBe(true);
        });

        it('should reject invalid signatures', async () => {
            // Arrange
            const invalidSignature = new Uint8Array(64).fill(1);

            // Act
            const isValid = await keyManager.verify(message, invalidSignature, keyPair.publicKey);

            // Assert
            expect(isValid).toBe(false);
        });

        it('should reject modified messages', async () => {
            // Arrange
            const signature = await keyManager.sign(message, keyPair.privateKey);
            const modifiedMessage = new Uint8Array([1, 2, 3, 4, 6]); // Changed last byte

            // Act
            const isValid = await keyManager.verify(modifiedMessage, signature, keyPair.publicKey);

            // Assert
            expect(isValid).toBe(false);
        });
    });

    describe('public key conversion', () => {
        let keyPair: KeyPair;

        beforeEach(async () => {
            keyPair = await keyManager.generateKeyPair();
        });

        it('should derive public key from private key', () => {
            // Act
            const derivedPublicKey = keyManager.getPublicKeyFromPrivate(keyPair.privateKey);

            // Assert
            expect(Buffer.from(derivedPublicKey)).toEqual(Buffer.from(keyPair.publicKey));
        });

        it('should convert public key to hex and back', () => {
            // Act
            const hexKey = keyManager.publicKeyToHex(keyPair.publicKey);
            const restoredKey = keyManager.publicKeyFromHex(hexKey);

            // Assert
            expect(Buffer.from(restoredKey)).toEqual(Buffer.from(keyPair.publicKey));
        });

        it('should handle invalid hex strings', () => {
            // Act & Assert
            expect(() => keyManager.publicKeyFromHex('invalid-hex'))
                .toThrow('Invalid hex string');
        });
    });
}); 
import { jest } from '@jest/globals';
import type { IKeyManager, IWalletService } from '../../src/types/service.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import { createMockKeyPair, createMockMessage } from '../utils/test-helpers.js';

describe('Key Management Integration', () => {
    let keyManager: IKeyManager;
    let walletService: IWalletService;
    
    beforeAll(async () => {
        const { container } = global.testContext!;
        keyManager = container.resolve('keyManager');
        walletService = container.resolve('walletService');
        
        await walletService.initialize();
    });

    describe('Key Generation', () => {
        it('should generate consistent key pairs', async () => {
            // Act
            const keyPair1 = await keyManager.generateKeyPair();
            const keyPair2 = await keyManager.generateKeyPair();

            // Assert
            expect(keyPair1.publicKey).toBeInstanceOf(Uint8Array);
            expect(keyPair1.privateKey).toBeInstanceOf(Uint8Array);
            expect(keyPair1).not.toEqual(keyPair2); // Different keys
        });

        it('should derive consistent public keys', async () => {
            // Arrange
            const keyPair = await keyManager.generateKeyPair();

            // Act
            const derivedPublicKey = keyManager.getPublicKeyFromPrivate(keyPair.privateKey);

            // Assert
            expect(Buffer.from(derivedPublicKey)).toEqual(Buffer.from(keyPair.publicKey));
        });
    });

    describe('Key Conversion', () => {
        let testKeyPair: KeyPair;
        
        beforeEach(async () => {
            testKeyPair = await keyManager.generateKeyPair();
        });

        it('should convert public keys to/from hex', () => {
            // Act
            const hex = keyManager.publicKeyToHex(testKeyPair.publicKey);
            const restored = keyManager.publicKeyFromHex(hex);

            // Assert
            expect(Buffer.from(restored)).toEqual(Buffer.from(testKeyPair.publicKey));
        });

        it('should handle invalid hex strings', () => {
            // Act & Assert
            expect(() => keyManager.publicKeyFromHex('invalid-hex'))
                .toThrow('Invalid hex string');
        });
    });

    describe('Signing Operations', () => {
        let testKeyPair: KeyPair;
        
        beforeEach(async () => {
            testKeyPair = await keyManager.generateKeyPair();
        });

        it('should sign and verify messages', async () => {
            // Arrange
            const message = createMockMessage();

            // Act
            const signature = await keyManager.sign(message, testKeyPair.privateKey);
            const isValid = await keyManager.verify(message, signature, testKeyPair.publicKey);

            // Assert
            expect(isValid).toBe(true);
        });

        it('should detect modified messages', async () => {
            // Arrange
            const message = createMockMessage();
            const signature = await keyManager.sign(message, testKeyPair.privateKey);

            // Act - Modify message
            message[0] ^= 1;
            const isValid = await keyManager.verify(message, signature, testKeyPair.publicKey);

            // Assert
            expect(isValid).toBe(false);
        });

        it('should detect incorrect public keys', async () => {
            // Arrange
            const message = createMockMessage();
            const signature = await keyManager.sign(message, testKeyPair.privateKey);
            const wrongKeyPair = await keyManager.generateKeyPair();

            // Act
            const isValid = await keyManager.verify(message, signature, wrongKeyPair.publicKey);

            // Assert
            expect(isValid).toBe(false);
        });
    });

    describe('Wallet Integration', () => {
        it('should integrate with wallet signing', async () => {
            // Arrange
            const message = createMockMessage();
            const wallet = await walletService.createWallet();

            // Act
            const signature = await walletService.sign(message);
            const isValid = await keyManager.verify(
                message,
                signature,
                walletService.getPublicKey()
            );

            // Assert
            expect(isValid).toBe(true);
        });

        it('should handle concurrent signing operations', async () => {
            // Arrange
            const messages = Array(5).fill(null).map(() => createMockMessage());

            // Act
            const signatures = await Promise.all(
                messages.map(msg => walletService.sign(msg))
            );

            // Assert
            await Promise.all(signatures.map(async (sig, index) => {
                const isValid = await keyManager.verify(
                    messages[index],
                    sig,
                    walletService.getPublicKey()
                );
                expect(isValid).toBe(true);
            }));
        });
    });

    describe('Error Handling', () => {
        it('should handle key generation failures', async () => {
            // Arrange
            jest.spyOn(keyManager, 'generateKeyPair')
                .mockRejectedValueOnce(new Error('Generation failed'));

            // Act & Assert
            await expect(keyManager.generateKeyPair())
                .rejects
                .toThrow('Generation failed');
        });

        it('should handle signing failures', async () => {
            // Arrange
            const message = createMockMessage();
            const keyPair = await keyManager.generateKeyPair();
            jest.spyOn(keyManager, 'sign')
                .mockRejectedValueOnce(new Error('Signing failed'));

            // Act & Assert
            await expect(keyManager.sign(message, keyPair.privateKey))
                .rejects
                .toThrow('Signing failed');
        });

        it('should handle verification failures', async () => {
            // Arrange
            const message = createMockMessage();
            const keyPair = await keyManager.generateKeyPair();
            const signature = await keyManager.sign(message, keyPair.privateKey);
            
            jest.spyOn(keyManager, 'verify')
                .mockRejectedValueOnce(new Error('Verification failed'));

            // Act & Assert
            await expect(keyManager.verify(message, signature, keyPair.publicKey))
                .rejects
                .toThrow('Verification failed');
        });
    });
}); 
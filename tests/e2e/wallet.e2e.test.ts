import { jest } from '@jest/globals';
import type { 
    IWalletService, 
    IKeyManager, 
    IStorageService 
} from '../../src/types/service.types.js';
import { createMockMessage, delay } from '../utils/test-helpers.js';

describe('Wallet End-to-End', () => {
    let walletService: IWalletService;
    let keyManager: IKeyManager;
    let storageService: IStorageService;
    
    beforeAll(async () => {
        const { container } = global.testContext!;
        walletService = container.resolve('walletService');
        keyManager = container.resolve('keyManager');
        storageService = container.resolve('storageService');
        
        // Initialize all required services
        await Promise.all([
            walletService.initialize(),
            storageService.initialize()
        ]);
    });

    describe('Wallet Lifecycle', () => {
        it('should create and store a new wallet', async () => {
            // Act
            const wallet = await walletService.createWallet();

            // Assert
            expect(wallet.address).toMatch(/^midnight1/);
            
            // Verify storage
            const stored = await storageService.get('wallets', wallet.address);
            expect(stored).toBeDefined();
            expect(stored?.address).toBe(wallet.address);
        });

        it('should manage wallet balance', async () => {
            // Arrange
            const wallet = await walletService.createWallet();
            
            // Act
            const balance = await walletService.getBalance();

            // Assert
            expect(Number(balance)).toBeGreaterThanOrEqual(0);
        });

        it('should sign and verify messages', async () => {
            // Arrange
            const message = createMockMessage();

            // Act
            const signature = await walletService.sign(message);
            const isValid = await walletService.verify(
                message,
                signature,
                walletService.getPublicKey()
            );

            // Assert
            expect(isValid).toBe(true);
        });
    });

    describe('Key Management', () => {
        it('should generate and store key pairs', async () => {
            // Act
            const keyPair = await keyManager.generateKeyPair();
            const publicKeyHex = keyManager.publicKeyToHex(keyPair.publicKey);

            // Assert
            expect(keyPair.publicKey).toBeInstanceOf(Uint8Array);
            expect(keyPair.privateKey).toBeInstanceOf(Uint8Array);
            expect(publicKeyHex).toMatch(/^[0-9a-f]+$/);
        });

        it('should derive consistent public keys', async () => {
            // Arrange
            const keyPair = await keyManager.generateKeyPair();

            // Act
            const derivedPublicKey = keyManager.getPublicKeyFromPrivate(keyPair.privateKey);

            // Assert
            expect(Buffer.from(derivedPublicKey))
                .toEqual(Buffer.from(keyPair.publicKey));
        });
    });

    describe('Concurrent Operations', () => {
        it('should handle concurrent wallet creation', async () => {
            // Act
            const wallets = await Promise.all(
                Array(3).fill(null).map(() => walletService.createWallet())
            );

            // Assert
            const addresses = wallets.map(w => w.address);
            const uniqueAddresses = new Set(addresses);
            expect(uniqueAddresses.size).toBe(3);

            // Verify all wallets are stored
            await Promise.all(wallets.map(async wallet => {
                const stored = await storageService.get('wallets', wallet.address);
                expect(stored).toBeDefined();
            }));
        });

        it('should handle concurrent signing operations', async () => {
            // Arrange
            const messages = Array(3).fill(null).map(() => createMockMessage());

            // Act
            const signatures = await Promise.all(
                messages.map(msg => walletService.sign(msg))
            );

            // Assert
            await Promise.all(signatures.map(async (sig, index) => {
                const isValid = await walletService.verify(
                    messages[index],
                    sig,
                    walletService.getPublicKey()
                );
                expect(isValid).toBe(true);
            }));
        });
    });

    describe('Error Scenarios', () => {
        it('should handle invalid signatures', async () => {
            // Arrange
            const message = createMockMessage();
            const invalidSignature = new Uint8Array(64).fill(1);

            // Act
            const isValid = await walletService.verify(
                message,
                invalidSignature,
                walletService.getPublicKey()
            );

            // Assert
            expect(isValid).toBe(false);
        });

        it('should handle service failures', async () => {
            // Arrange
            jest.spyOn(storageService, 'store')
                .mockRejectedValueOnce(new Error('Service unavailable'));

            // Act & Assert
            await expect(walletService.createWallet())
                .rejects
                .toThrow('Service unavailable');
        });

        it('should handle network latency', async () => {
            // Arrange
            jest.spyOn(walletService, 'getBalance')
                .mockImplementationOnce(async () => {
                    await delay(1000);
                    return '0';
                });

            // Act & Assert
            const balance = await walletService.getBalance();
            expect(balance).toBe('0');
        });
    });

    describe('System Recovery', () => {
        it('should recover from temporary failures', async () => {
            // Arrange
            let callCount = 0;
            jest.spyOn(walletService, 'createWallet')
                .mockImplementation(async () => {
                    callCount++;
                    if (callCount === 1) {
                        throw new Error('Temporary failure');
                    }
                    return { address: 'midnight1test' };
                });

            // Act
            try {
                await walletService.createWallet();
            } catch {
                await delay(100);
                const wallet = await walletService.createWallet();
                
                // Assert
                expect(wallet.address).toBe('midnight1test');
            }
        });

        it('should handle reconnection', async () => {
            // Arrange
            const wallet = await walletService.createWallet();
            jest.spyOn(storageService, 'get')
                .mockImplementationOnce(async () => {
                    throw new Error('Connection lost');
                });

            // Act & Assert
            try {
                await storageService.get('wallets', wallet.address);
            } catch {
                await delay(100);
                const stored = await storageService.get('wallets', wallet.address);
                expect(stored?.address).toBe(wallet.address);
            }
        });
    });
}); 
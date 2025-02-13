import { jest } from '@jest/globals';
import type { IWalletService, IKeyManager } from '../../src/types/service.types.js';
import type { KeyPair } from '../../src/types/key.types.js';

describe('WalletService', () => {
    let walletService: IWalletService;
    let keyManager: jest.Mocked<IKeyManager>;
    
    beforeEach(() => {
        // Get services from container
        const { container, mocks } = global.testContext;
        walletService = container.resolve('walletService');
        keyManager = mocks.keyManager;
    });

    describe('initialize', () => {
        it('should initialize wallet with new key pair', async () => {
            // Arrange
            const mockKeyPair: KeyPair = {
                publicKey: new Uint8Array([1, 2, 3]),
                privateKey: new Uint8Array([4, 5, 6])
            };
            keyManager.generateKeyPair.mockResolvedValue(mockKeyPair);

            // Act
            await walletService.initialize();

            // Assert
            expect(keyManager.generateKeyPair).toHaveBeenCalled();
            expect(walletService.getPublicKey()).toEqual(mockKeyPair.publicKey);
        });

        it('should throw if key generation fails', async () => {
            // Arrange
            keyManager.generateKeyPair.mockRejectedValue(new Error('Key generation failed'));

            // Act & Assert
            await expect(walletService.initialize())
                .rejects
                .toThrow('Key generation failed');
        });
    });

    describe('createWallet', () => {
        it('should create a new wallet address', async () => {
            // Arrange
            await walletService.initialize();

            // Act
            const result = await walletService.createWallet();

            // Assert
            expect(result.address).toMatch(/^midnight1/);
        });

        it('should throw if not initialized', async () => {
            // Act & Assert
            await expect(walletService.createWallet())
                .rejects
                .toThrow('Wallet not initialized');
        });
    });

    describe('sign and verify', () => {
        const testMessage = new Uint8Array([1, 2, 3]);
        const testSignature = new Uint8Array([4, 5, 6]);

        beforeEach(async () => {
            await walletService.initialize();
            keyManager.sign.mockResolvedValue(testSignature);
        });

        it('should sign messages', async () => {
            // Act
            const signature = await walletService.sign(testMessage);

            // Assert
            expect(signature).toEqual(testSignature);
            expect(keyManager.sign).toHaveBeenCalledWith(
                testMessage,
                expect.any(Uint8Array) // privateKey
            );
        });

        it('should verify signatures', async () => {
            // Arrange
            keyManager.verify.mockResolvedValue(true);
            const publicKey = walletService.getPublicKey();

            // Act
            const isValid = await walletService.verify(
                testMessage,
                testSignature,
                publicKey
            );

            // Assert
            expect(isValid).toBe(true);
            expect(keyManager.verify).toHaveBeenCalledWith(
                testMessage,
                testSignature,
                publicKey
            );
        });
    });

    describe('getBalance', () => {
        it('should return wallet balance', async () => {
            // Arrange
            await walletService.initialize();

            // Act
            const balance = await walletService.getBalance();

            // Assert
            expect(balance).toBe('1000'); // Default mock value
        });

        it('should throw if not initialized', async () => {
            // Act & Assert
            await expect(walletService.getBalance())
                .rejects
                .toThrow('Wallet not initialized');
        });
    });
}); 
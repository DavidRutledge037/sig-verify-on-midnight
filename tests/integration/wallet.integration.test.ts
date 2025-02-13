import { jest } from '@jest/globals';
import { Container } from '../../src/core/container.js';
import type { 
    IWalletService, 
    IKeyManager, 
    IStorageService 
} from '../../src/types/service.types.js';
import type { KeyPair } from '../../src/types/key.types.js';

describe('Wallet Integration', () => {
    let container: Container;
    let walletService: IWalletService;
    let keyManager: IKeyManager;
    let storageService: IStorageService;
    
    beforeAll(async () => {
        // Get container instance
        container = Container.getInstance();
        
        // Get services
        walletService = container.resolve('walletService');
        keyManager = container.resolve('keyManager');
        storageService = container.resolve('storageService');
        
        // Initialize services
        await walletService.initialize();
        await storageService.initialize();
    });

    afterAll(async () => {
        container.cleanup();
    });

    describe('Wallet Lifecycle', () => {
        let wallet: { address: string };
        let keyPair: KeyPair;

        it('should create a new wallet with key pair', async () => {
            // Act
            wallet = await walletService.createWallet();
            keyPair = await keyManager.generateKeyPair();

            // Assert
            expect(wallet.address).toMatch(/^midnight1/);
            expect(keyPair.publicKey).toBeInstanceOf(Uint8Array);
            expect(keyPair.privateKey).toBeInstanceOf(Uint8Array);
        });

        it('should store wallet credentials securely', async () => {
            // Act
            const id = await storageService.store('wallets', {
                address: wallet.address,
                publicKey: keyManager.publicKeyToHex(keyPair.publicKey)
            });

            // Assert
            expect(id).toBeTruthy();
            
            // Verify storage
            const stored = await storageService.get('wallets', id);
            expect(stored?.address).toBe(wallet.address);
        });

        it('should sign and verify messages', async () => {
            // Arrange
            const message = new TextEncoder().encode('test message');

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

        it('should manage wallet balance', async () => {
            // Act
            const balance = await walletService.getBalance();

            // Assert
            expect(balance).toBeTruthy();
            expect(Number(balance)).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Key Management', () => {
        it('should derive consistent public keys', async () => {
            // Arrange
            const keyPair = await keyManager.generateKeyPair();

            // Act
            const derivedPublicKey = keyManager.getPublicKeyFromPrivate(keyPair.privateKey);

            // Assert
            expect(Buffer.from(derivedPublicKey))
                .toEqual(Buffer.from(keyPair.publicKey));
        });

        it('should handle key conversion formats', () => {
            // Arrange
            const originalKey = new Uint8Array([1, 2, 3]);

            // Act
            const hexKey = keyManager.publicKeyToHex(originalKey);
            const restoredKey = keyManager.publicKeyFromHex(hexKey);

            // Assert
            expect(Buffer.from(restoredKey))
                .toEqual(Buffer.from(originalKey));
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid signatures', async () => {
            // Arrange
            const message = new TextEncoder().encode('test message');
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

        it('should handle wallet creation errors', async () => {
            // Arrange
            jest.spyOn(keyManager, 'generateKeyPair')
                .mockRejectedValueOnce(new Error('Key generation failed'));

            // Act & Assert
            await expect(walletService.createWallet())
                .rejects
                .toThrow('Key generation failed');
        });

        it('should handle storage errors', async () => {
            // Arrange
            jest.spyOn(storageService, 'store')
                .mockRejectedValueOnce(new Error('Storage failed'));

            // Act & Assert
            await expect(
                storageService.store('wallets', { address: 'test' })
            ).rejects.toThrow('Storage failed');
        });
    });

    describe('Concurrent Operations', () => {
        it('should handle concurrent wallet creation', async () => {
            // Arrange
            const createPromises = Array(3).fill(null)
                .map(() => walletService.createWallet());

            // Act
            const results = await Promise.all(createPromises);

            // Assert
            const addresses = results.map(wallet => wallet.address);
            const uniqueAddresses = new Set(addresses);
            expect(uniqueAddresses.size).toBe(3);
        });

        it('should handle concurrent signing operations', async () => {
            // Arrange
            const message = new TextEncoder().encode('test message');
            const signPromises = Array(3).fill(null)
                .map(() => walletService.sign(message));

            // Act
            const signatures = await Promise.all(signPromises);

            // Assert
            const uniqueSignatures = new Set(signatures.map(sig => 
                Buffer.from(sig).toString('hex')
            ));
            expect(uniqueSignatures.size).toBe(3);
        });
    });
}); 
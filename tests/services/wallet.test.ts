import { jest } from '@jest/globals';
import { WalletService } from '../../src/services/wallet.service';
import { KeyManager } from '../../src/identity/keys';
import { KeyPair } from '../../src/types/key.types';

describe('Wallet Service Tests', () => {
    let walletService: WalletService;
    let mockKeyManager: jest.Mocked<KeyManager>;

    const mockKeyPair: KeyPair = {
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    };

    beforeEach(() => {
        mockKeyManager = {
            generateKeyPair: jest.fn().mockResolvedValue(mockKeyPair),
            sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            verify: jest.fn().mockResolvedValue(true),
            deriveAddress: jest.fn().mockReturnValue('midnight1test123')
        } as jest.Mocked<KeyManager>;

        walletService = new WalletService(mockKeyManager);
    });

    it('should initialize wallet', async () => {
        await walletService.initialize();
        expect(mockKeyManager.generateKeyPair).toHaveBeenCalled();
        expect(walletService.getAddress()).toBe('midnight1test123');
    });

    it('should sign a message', async () => {
        await walletService.initialize();
        const message = new Uint8Array([1, 2, 3]);
        const signature = await walletService.sign(message);
        expect(signature).toEqual(new Uint8Array([1, 2, 3]));
        expect(mockKeyManager.sign).toHaveBeenCalledWith(message, mockKeyPair.privateKey);
    });

    it('should verify a signature', async () => {
        const message = new Uint8Array([1, 2, 3]);
        const signature = new Uint8Array([1, 2, 3]);
        const publicKey = new Uint8Array([1, 2, 3]);
        const isValid = await walletService.verify(message, signature, publicKey);
        expect(isValid).toBe(true);
        expect(mockKeyManager.verify).toHaveBeenCalledWith(message, signature, publicKey);
    });

    it('should handle signing errors', async () => {
        await walletService.initialize();
        const error = new Error('Signing failed');
        mockKeyManager.sign.mockRejectedValueOnce(error);
        const message = new Uint8Array([1, 2, 3]);
        await expect(walletService.sign(message)).rejects.toThrow('Signing failed');
    });

    it('should handle verification errors', async () => {
        const error = new Error('Verification failed');
        mockKeyManager.verify.mockRejectedValueOnce(error);
        const message = new Uint8Array([1, 2, 3]);
        const signature = new Uint8Array([1, 2, 3]);
        const publicKey = new Uint8Array([1, 2, 3]);
        await expect(walletService.verify(message, signature, publicKey))
            .rejects.toThrow('Verification failed');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
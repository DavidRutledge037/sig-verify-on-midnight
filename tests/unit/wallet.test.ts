import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { WalletService } from '../../src/services/wallet';
import { KeyManager } from '../../src/identity/keys';

describe('Wallet Unit Tests', () => {
    let walletService: WalletService;
    let mockKeyManager: jest.Mocked<KeyManager>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockKeyManager = {
            generateKeyPair: jest.fn(),
            sign: jest.fn(),
            verify: jest.fn(),
            getPublicKey: jest.fn(),
            getPrivateKey: jest.fn()
        } as unknown as jest.Mocked<KeyManager>;

        walletService = new WalletService();
        (walletService as any).keyManager = mockKeyManager;
    });

    it('should create wallet with address', async () => {
        const mockKeyPair = {
            publicKey: new Uint8Array([1, 2, 3]),
            privateKey: new Uint8Array([4, 5, 6])
        };
        mockKeyManager.generateKeyPair.mockReturnValue(mockKeyPair);
        
        const wallet = await walletService.createWallet();
        
        expect(wallet).toBeDefined();
        expect(wallet.address).toBeDefined();
        expect(mockKeyManager.generateKeyPair).toHaveBeenCalled();
    });

    it('should sign messages', async () => {
        const message = 'test message';
        const mockSignature = new Uint8Array([1, 2, 3]);
        mockKeyManager.sign.mockReturnValue(mockSignature);
        
        const signature = await walletService.sign(message);
        
        expect(signature).toBeDefined();
        expect(mockKeyManager.sign).toHaveBeenCalledWith(message);
    });

    it('should verify signatures', async () => {
        const message = 'test message';
        const signature = new Uint8Array([1, 2, 3]);
        mockKeyManager.verify.mockReturnValue(true);
        
        const isValid = await walletService.verify(message, signature);
        
        expect(isValid).toBe(true);
        expect(mockKeyManager.verify).toHaveBeenCalledWith(message, signature);
    });

    // ... rest of tests ...
}); 
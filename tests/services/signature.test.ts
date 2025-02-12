import { jest } from '@jest/globals';
import { SignatureService } from '../../src/services/signature.service';
import { WalletService } from '../../src/services/wallet.service';
import { KeyPair } from '../../src/types/key.types';

describe('Signature Service Tests', () => {
    let signatureService: SignatureService;
    let mockWalletService: jest.Mocked<WalletService>;

    const mockKeyPair: KeyPair = {
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    };

    const mockSignature = new Uint8Array([7, 8, 9]);
    const testMessage = new Uint8Array([1, 2, 3]);

    beforeEach(() => {
        mockWalletService = {
            keyManager: {
                generateKeyPair: jest.fn().mockResolvedValue(mockKeyPair),
                sign: jest.fn().mockResolvedValue(mockSignature),
                verify: jest.fn().mockResolvedValue(true),
                deriveAddress: jest.fn().mockReturnValue('midnight1test123')
            },
            wallet: {
                address: 'midnight1test123',
                pubkey: new Uint8Array([1, 2, 3])
            },
            client: {
                signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
            },
            currentKeyPair: mockKeyPair,
            createWallet: jest.fn().mockResolvedValue(undefined),
            sign: jest.fn().mockResolvedValue(mockSignature),
            verify: jest.fn().mockResolvedValue(true),
            getAddress: jest.fn().mockReturnValue('midnight1test123'),
            initialize: jest.fn().mockResolvedValue(undefined),
            getClient: jest.fn().mockResolvedValue({
                signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
            }),
            getBalance: jest.fn().mockResolvedValue('1000'),
            displayBalance: jest.fn().mockReturnValue('1.0 NIGHT'),
            signMessage: jest.fn().mockResolvedValue(mockSignature)
        } as unknown as jest.Mocked<WalletService>;

        signatureService = new SignatureService(mockWalletService);
    });

    it('should sign a message', async () => {
        const signature = await signatureService.sign(testMessage);
        expect(signature).toEqual(mockSignature);
        expect(mockWalletService.sign).toHaveBeenCalledWith(testMessage);
    });

    it('should verify a signature', async () => {
        const isValid = await signatureService.verify(testMessage, mockSignature, mockKeyPair.publicKey);
        expect(isValid).toBe(true);
        expect(mockWalletService.verify).toHaveBeenCalledWith(testMessage, mockSignature, mockKeyPair.publicKey);
    });

    it('should handle invalid signatures', async () => {
        mockWalletService.verify.mockResolvedValueOnce(false);
        const isValid = await signatureService.verify(testMessage, mockSignature, mockKeyPair.publicKey);
        expect(isValid).toBe(false);
    });

    it('should handle signing errors', async () => {
        const error = new Error('Signing failed');
        mockWalletService.sign.mockRejectedValueOnce(error);
        await expect(signatureService.sign(testMessage)).rejects.toThrow('Signing failed');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
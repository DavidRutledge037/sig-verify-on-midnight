import { jest } from '@jest/globals';
import { DIDService } from '../services/did.service';
import { WalletService } from '../services/wallet.service';
import { DIDDocument } from '../types/did.types';
import { KeyPair } from '../types/key.types';

describe('DID Service Tests', () => {
    let didService: DIDService;
    let mockWalletService: jest.Mocked<WalletService>;

    const mockKeyPair: KeyPair = {
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    };

    const testDID: DIDDocument = {
        id: 'did:midnight:test123',
        controller: 'did:midnight:controller123',
        verificationMethod: [],
        authentication: [],
        assertionMethod: [],
        keyAgreement: [],
        capabilityInvocation: [],
        capabilityDelegation: [],
        service: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        status: 'active' as const
    };

    beforeEach(() => {
        const walletServiceMock = {
            keyManager: {
                generateKeyPair: jest.fn().mockResolvedValue(mockKeyPair),
                sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
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
            sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            verify: jest.fn().mockResolvedValue(true),
            getAddress: jest.fn().mockReturnValue('midnight1test123'),
            initialize: jest.fn().mockResolvedValue(undefined),
            getClient: jest.fn().mockResolvedValue({
                signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
            }),
            getBalance: jest.fn().mockResolvedValue('1000'),
            displayBalance: jest.fn().mockReturnValue('1.0 NIGHT'),
            signMessage: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
        };

        mockWalletService = walletServiceMock as unknown as jest.Mocked<WalletService>;
        didService = new DIDService(mockWalletService);
    });

    it('should create a DID', async () => {
        const did = await didService.createDID();
        expect(did).toBeDefined();
        expect(did.id).toMatch(/^did:midnight:/);
        expect(did.controller).toBe(testDID.controller);
        expect(did.status).toBe('active');
    });

    it('should verify a DID', async () => {
        const isValid = await didService.verifyDID(testDID);
        expect(isValid).toBe(true);
        expect(mockWalletService.verify).toHaveBeenCalled();
    });

    it('should handle invalid DID verification', async () => {
        mockWalletService.verify.mockResolvedValueOnce(false);
        const isValid = await didService.verifyDID(testDID);
        expect(isValid).toBe(false);
    });

    it('should throw error for invalid DID format', async () => {
        const invalidDID = { ...testDID, id: 'invalid:did:format' };
        await expect(didService.verifyDID(invalidDID)).rejects.toThrow();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
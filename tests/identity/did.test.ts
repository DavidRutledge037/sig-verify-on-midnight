import { jest } from '@jest/globals';
import { DIDManager } from '../../src/identity/did';
import { WalletService } from '../../src/services/wallet.service';
import { DIDDocument } from '../../src/types/did.types';
import { KeyPair } from '../../src/types/key.types';

describe('DID Manager Tests', () => {
    let didManager: DIDManager;
    let mockWalletService: jest.Mocked<WalletService>;

    const mockKeyPair: KeyPair = {
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    };

    beforeEach(() => {
        mockWalletService = {
            initialize: jest.fn().mockResolvedValue(undefined),
            createWallet: jest.fn().mockResolvedValue(undefined),
            getClient: jest.fn().mockResolvedValue({
                signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
            }),
            getAddress: jest.fn().mockReturnValue('midnight1test123'),
            sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            verify: jest.fn().mockResolvedValue(true),
            signMessage: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            getBalance: jest.fn().mockResolvedValue('1000'),
            displayBalance: jest.fn().mockReturnValue('1000 NIGHT'),
            isInitialized: jest.fn().mockReturnValue(true),
            getPublicKey: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
            keyManager: {
                generateKeyPair: jest.fn().mockResolvedValue(mockKeyPair),
                sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
                verify: jest.fn().mockResolvedValue(true),
                deriveAddress: jest.fn().mockReturnValue('midnight1test123')
            }
        } as unknown as jest.Mocked<WalletService>;

        didManager = new DIDManager(mockWalletService);
    });

    it('should create a DID', async () => {
        const did = await didManager.createDID();
        expect(did).toBeDefined();
        expect(did.id).toMatch(/^did:midnight:/);
        expect(did.controller).toBeDefined();
        expect(did.verificationMethod).toHaveLength(1);
        expect(did.status).toBe('active');
    });

    it('should verify a valid DID', async () => {
        const did: DIDDocument = {
            id: 'did:midnight:test123',
            controller: 'did:midnight:test123',
            verificationMethod: [{
                id: 'did:midnight:test123#key-1',
                type: 'Ed25519VerificationKey2020',
                controller: 'did:midnight:test123',
                publicKeyMultibase: 'test'
            }],
            authentication: ['did:midnight:test123#key-1'],
            assertionMethod: [],
            keyAgreement: [],
            capabilityInvocation: [],
            capabilityDelegation: [],
            service: [],
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            status: 'active'
        };

        const isValid = await didManager.verifyDID(did);
        expect(isValid).toBe(true);
    });

    it('should reject invalid DID format', async () => {
        const invalidDid = { ...mockValidDID, id: 'invalid:did:format' };
        await expect(didManager.verifyDID(invalidDid)).rejects.toThrow('Invalid DID format');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
import { jest } from '@jest/globals';
import { DIDService } from '../../src/services/did.service';
import { WalletService } from '../../src/services/wallet.service';
import { DIDDocument } from '../../src/types/did.types';
import { KeyPair } from '../../src/types/key.types';

describe('DID Service Tests', () => {
    let didService: DIDService;
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
            getBalance: jest.fn().mockResolvedValue('1000'),
            displayBalance: jest.fn().mockReturnValue('1.0 NIGHT'),
            signMessage: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            isInitialized: jest.fn().mockReturnValue(true),
            getPublicKey: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
            currentKeyPair: mockKeyPair,
            wallet: undefined,
            client: undefined,
            keyManager: {
                generateKeyPair: jest.fn().mockResolvedValue(mockKeyPair),
                sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
                verify: jest.fn().mockResolvedValue(true),
                deriveAddress: jest.fn().mockReturnValue('midnight1test123'),
                getPublicKeyFromPrivate: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
                publicKeyToHex: jest.fn().mockReturnValue('123456'),
                publicKeyFromHex: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3]))
            }
        } as unknown as jest.Mocked<WalletService>;

        didService = new DIDService(mockWalletService);
    });

    it('should create a DID', async () => {
        const did = await didService.createDID();
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

        const isValid = await didService.verifyDID(did);
        expect(isValid).toBe(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
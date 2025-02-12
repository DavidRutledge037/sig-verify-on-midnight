import { jest } from '@jest/globals';
import { APIService } from '../../src/services/api.service';
import { DIDService } from '../../src/services/did.service';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { DatabaseService } from '../../src/services/database.service';
import { WalletService } from '../../src/services/wallet.service';
import { DIDDocument } from '../../src/types/did.types';

describe('API Service Tests', () => {
    let apiService: APIService;
    let mockDIDService: jest.Mocked<DIDService>;
    let mockStorageService: jest.Mocked<DIDStorageService>;
    let mockDbService: jest.Mocked<DatabaseService>;
    let mockWalletService: jest.Mocked<WalletService>;

    const testDID: DIDDocument = {
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

    beforeEach(() => {
        mockDIDService = {
            createDID: jest.fn().mockResolvedValue(testDID),
            verifyDID: jest.fn().mockResolvedValue(true),
            resolveDID: jest.fn().mockResolvedValue({ 
                didDocument: testDID,
                didResolutionMetadata: { contentType: 'application/did+json' },
                didDocumentMetadata: { created: new Date().toISOString() }
            }),
            revokeDID: jest.fn().mockResolvedValue(true),
            isValidDIDFormat: jest.fn().mockReturnValue(true),
            addService: jest.fn().mockResolvedValue(true)
        } as jest.Mocked<DIDService>;

        mockStorageService = {
            COLLECTION_NAME: 'dids',
            initialize: jest.fn().mockResolvedValue(undefined),
            getDID: jest.fn().mockResolvedValue(testDID),
            storeDID: jest.fn().mockResolvedValue(undefined),
            updateDID: jest.fn().mockResolvedValue(true),
            deleteDID: jest.fn().mockResolvedValue(true),
            getDIDsByController: jest.fn().mockResolvedValue([testDID]),
            getDIDsByStatus: jest.fn().mockResolvedValue([testDID]),
            exists: jest.fn().mockResolvedValue(true)
        } as jest.Mocked<DIDStorageService>;

        mockDbService = {
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
            getCollection: jest.fn().mockResolvedValue({}),
            getClient: jest.fn().mockReturnValue({}),
            isConnectedToDatabase: jest.fn().mockReturnValue(true),
            getDatabaseName: jest.fn().mockReturnValue('testdb')
        } as jest.Mocked<DatabaseService>;

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
            getPublicKey: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3]))
        } as jest.Mocked<WalletService>;

        apiService = new APIService(mockDIDService, mockStorageService, mockDbService);
    });

    it('should create a DID', async () => {
        const did = await apiService.createDID();
        expect(did).toBeDefined();
        expect(mockDIDService.createDID).toHaveBeenCalled();
        expect(mockStorageService.storeDID).toHaveBeenCalledWith(did);
    });

    it('should verify a valid DID', async () => {
        const result = await apiService.verifyDID(testDID);
        expect(result).toBe(true);
        expect(mockDIDService.verifyDID).toHaveBeenCalledWith(testDID);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
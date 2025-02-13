import { jest } from '@jest/globals';
import { APIService } from '../../src/services/api.service';
import { DIDService } from '../../src/services/did.service';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { WalletService } from '../../src/services/wallet.service';
import { DatabaseService } from '../../src/services/database.service';
import { createMockDIDService, createMockStorageService, createMockWalletService } from '../utils/service-mocks';
import { DIDDocument } from '../../src/types/did.types';

describe('API Service Tests', () => {
    let apiService: APIService;
    let mockDIDService: jest.Mocked<DIDService>;
    let mockStorageService: jest.Mocked<DIDStorageService>;
    let mockWalletService: jest.Mocked<WalletService>;
    let mockDatabaseService: jest.Mocked<DatabaseService>;

    const testDID: DIDDocument = {
        id: 'did:midnight:test123',
        controller: 'did:midnight:controller123',
        verificationMethod: [{
            id: 'did:midnight:test123#key-1',
            type: 'Ed25519VerificationKey2020',
            controller: 'did:midnight:test123',
            publicKeyHex: '123456'
        }],
        authentication: ['did:midnight:test123#key-1'],
        assertionMethod: ['did:midnight:test123#key-1'],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };

    beforeEach(() => {
        mockDIDService = createMockDIDService();
        mockStorageService = createMockStorageService();
        mockWalletService = createMockWalletService();
        mockDatabaseService = {
            client: undefined,
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
            getCollection: jest.fn().mockResolvedValue({})
        } as jest.Mocked<DatabaseService>;

        // Set up specific mock implementations
        mockDIDService.createDID.mockResolvedValue(testDID);
        mockDIDService.verifyDID.mockResolvedValue(true);
        mockDIDService.resolveDID.mockResolvedValue({
            didDocument: testDID,
            didResolutionMetadata: { contentType: 'application/did+json' },
            didDocumentMetadata: { created: new Date().toISOString() }
        });

        apiService = new APIService(mockDIDService, mockStorageService, mockWalletService, mockDatabaseService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a DID', async () => {
        const result = await apiService.createDID('test-controller');
        expect(result).toEqual(testDID);
        expect(mockDIDService.createDID).toHaveBeenCalledWith('test-controller');
    });

    // Add more tests...
}); 
import { jest } from '@jest/globals';
import { DIDResolver } from '../../src/identity/resolver';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { DIDDocument } from '../../src/types/did.types';
import { DatabaseService } from '../../src/services/database';
import { Collection } from 'mongodb';

describe('DID Resolver Tests', () => {
    let resolver: DIDResolver;
    let mockStorageService: jest.Mocked<DIDStorageService>;
    let mockDbService: jest.Mocked<DatabaseService>;
    let mockCollection: jest.Mocked<Collection>;

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
        mockCollection = {
            findOne: jest.fn().mockResolvedValue(testDID),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn()
        } as unknown as jest.Mocked<Collection>;

        mockDbService = {
            connect: jest.fn().mockResolvedValue(void 0),
            disconnect: jest.fn().mockResolvedValue(void 0),
            getCollection: jest.fn().mockResolvedValue(mockCollection),
            getClient: jest.fn(),
            isConnectedToDatabase: jest.fn().mockReturnValue(true),
            getDatabaseName: jest.fn().mockReturnValue('test-db')
        } as unknown as jest.Mocked<DatabaseService>;

        mockStorageService = {
            getDID: jest.fn().mockResolvedValue(testDID),
            storeDID: jest.fn().mockResolvedValue(undefined),
            updateDID: jest.fn().mockResolvedValue(true),
            deleteDID: jest.fn().mockResolvedValue(undefined),
            initialize: jest.fn().mockResolvedValue(undefined),
            getDIDsByController: jest.fn().mockResolvedValue([testDID]),
            getDIDsByStatus: jest.fn().mockResolvedValue([testDID]),
            exists: jest.fn().mockResolvedValue(true)
        } as jest.Mocked<DIDStorageService>;

        resolver = new DIDResolver(mockStorageService);
    });

    it('should resolve a valid DID', async () => {
        const result = await resolver.resolve(testDID.id);
        expect(result).toEqual(testDID);
        expect(mockStorageService.getDID).toHaveBeenCalledWith(testDID.id);
    });

    it('should return null for non-existent DID', async () => {
        mockStorageService.getDID.mockResolvedValueOnce(null);
        const result = await resolver.resolve('did:midnight:nonexistent');
        expect(result).toBeNull();
    });

    it('should throw error for invalid DID format', async () => {
        await expect(resolver.resolve('invalid:did:format'))
            .rejects.toThrow('Invalid DID format');
    });

    it('should validate DID format', () => {
        expect(resolver.isValidDID(testDID.id)).toBe(true);
        expect(resolver.isValidDID('invalid:did:format')).toBe(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
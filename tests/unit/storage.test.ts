import { jest } from '@jest/globals';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { DatabaseService } from '../../src/services/database';
import { Collection, Document } from 'mongodb';
import { DIDDocument } from '../../src/types/did.types';

describe('DID Storage Service Tests', () => {
    let storageService: DIDStorageService;
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
        // Setup collection mock with proper types
        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn(),
            find: jest.fn()
        } as unknown as jest.Mocked<Collection<Document>>;

        // Setup database service mock with proper types
        mockDbService = {
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
            getCollection: jest.fn().mockResolvedValue(mockCollection)
        } as unknown as jest.Mocked<DatabaseService>;

        storageService = new DIDStorageService(mockDbService);
    });

    it('should store a DID', async () => {
        mockCollection.insertOne.mockResolvedValue({ 
            acknowledged: true,
            insertedId: testDID.id 
        });

        await storageService.storeDID(testDID);
        expect(mockCollection.insertOne).toHaveBeenCalledWith(testDID);
    });

    it('should retrieve a DID', async () => {
        mockCollection.findOne.mockResolvedValue(testDID);
        const result = await storageService.getDID(testDID.id);
        expect(result).toEqual(testDID);
        expect(mockCollection.findOne).toHaveBeenCalledWith({ id: testDID.id });
    });

    it('should update a DID', async () => {
        mockCollection.updateOne.mockResolvedValue({ 
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1
        });

        const result = await storageService.updateDID(testDID);
        expect(result).toBe(true);
        expect(mockCollection.updateOne).toHaveBeenCalledWith(
            { id: testDID.id },
            { $set: testDID }
        );
    });

    it('should check if DID exists', async () => {
        mockCollection.findOne.mockResolvedValue(testDID);
        const exists = await storageService.exists(testDID.id);
        expect(exists).toBe(true);
        expect(mockCollection.findOne).toHaveBeenCalledWith({ id: testDID.id });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
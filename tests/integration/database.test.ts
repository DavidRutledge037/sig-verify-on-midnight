import { jest } from '@jest/globals';
import { MongoClient, Collection, Db, ObjectId } from 'mongodb';
import { DatabaseService } from '../../src/services/database';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { DIDDocument } from '../../src/types/did.types';

describe('Database Integration Tests', () => {
    let dbService: DatabaseService;
    let didStorageService: DIDStorageService;
    let mockCollection: jest.Mocked<Collection>;
    let mockDb: Partial<Db>;
    let mockClient: Partial<MongoClient>;

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
        status: 'active'
    };

    beforeEach(() => {
        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn()
        } as unknown as jest.Mocked<Collection>;

        mockDb = {
            collection: jest.fn().mockReturnValue(mockCollection)
        };

        mockClient = {
            db: jest.fn().mockReturnValue(mockDb),
            connect: jest.fn().mockResolvedValue(undefined),
            close: jest.fn().mockResolvedValue(undefined)
        };

        dbService = new DatabaseService('mongodb://localhost:27017', 'test-db');
        // @ts-ignore - for testing purposes
        dbService['client'] = mockClient;
        // @ts-ignore - for testing purposes
        dbService['db'] = mockDb;

        didStorageService = new DIDStorageService(dbService);
    });

    it('should connect to database', async () => {
        await dbService.connect();
        expect(mockClient.connect).toHaveBeenCalled();
    });

    it('should store DID document', async () => {
        const insertedId = new ObjectId();
        mockCollection.insertOne.mockResolvedValue({ 
            acknowledged: true,
            insertedId 
        });

        await didStorageService.storeDID(testDID);
        expect(mockCollection.insertOne).toHaveBeenCalledWith(testDID);
    });

    it('should retrieve DID document', async () => {
        mockCollection.findOne.mockResolvedValue(testDID);
        const result = await didStorageService.getDID(testDID.id);
        expect(result).toEqual(testDID);
    });

    it('should update DID document', async () => {
        mockCollection.updateOne.mockResolvedValue({ 
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1
        });

        await didStorageService.updateDID(testDID);
        expect(mockCollection.updateOne).toHaveBeenCalledWith(
            { id: testDID.id },
            { $set: testDID }
        );
    });

    it('should delete DID document', async () => {
        mockCollection.deleteOne.mockResolvedValue({ 
            acknowledged: true,
            deletedCount: 1 
        });

        await didStorageService.deleteDID(testDID.id);
        expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: testDID.id });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
import { Collection, InsertOneResult, UpdateResult } from 'mongodb';
import { DIDStorageService } from '../../services/did-storage.service';
import { DIDDocument } from '../../types/did.types';

describe('DIDStorageService', () => {
    let storageService: DIDStorageService;
    let mockCollection: jest.Mocked<Collection>;
    let documents: Map<string, DIDDocument>;
    let testDID: DIDDocument;

    beforeEach(() => {
        documents = new Map();
        
        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        } as any;

        // Create test DID
        testDID = {
            id: 'did:midnight:test',
            controller: 'midnight1234567890',
            verificationMethod: [],
            authentication: [],
            assertionMethod: [],
            keyAgreement: [],
            capabilityInvocation: [],
            capabilityDelegation: [],
            service: [],
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        // Mock collection methods with proper types
        mockCollection.findOne.mockImplementation(async ({ id }) => {
            return documents.get(id as string) || null;
        });

        mockCollection.insertOne.mockImplementation(async (doc) => {
            documents.set(doc.id, doc as DIDDocument);
            return { 
                acknowledged: true,
                insertedId: doc.id 
            } as InsertOneResult<DIDDocument>;
        });

        mockCollection.updateOne.mockImplementation(async (filter: any, update: any) => {
            const id = filter.id;
            const doc = documents.get(id);
            if (doc) {
                const updated = { ...doc, ...update.$set };
                documents.set(id, updated);
                return { 
                    acknowledged: true,
                    matchedCount: 1,
                    modifiedCount: 1,
                    upsertedCount: 0,
                    upsertedId: null
                } as UpdateResult;
            }
            return {
                acknowledged: true,
                matchedCount: 0,
                modifiedCount: 0,
                upsertedCount: 0,
                upsertedId: null
            } as UpdateResult;
        });

        mockCollection.deleteOne.mockImplementation(async ({ id }) => {
            documents.delete(id as string);
            return { 
                acknowledged: true,
                deletedCount: 1 
            };
        });

        storageService = new DIDStorageService();
        (storageService as any).collection = mockCollection;
    });

    afterEach(() => {
        documents.clear();
        jest.clearAllMocks();
    });

    it('should store a DID document', async () => {
        await storageService.storeDID(testDID);
        const stored = await storageService.getDID(testDID.id);
        expect(stored).toEqual(testDID);
    });

    it('should retrieve a stored DID document', async () => {
        await storageService.storeDID(testDID);
        const stored = await storageService.getDID(testDID.id);
        expect(stored).toBeDefined();
        expect(stored?.id).toBe(testDID.id);
    });

    it('should update an existing DID document', async () => {
        await storageService.storeDID(testDID);
        const updated = { ...testDID, updated: new Date().toISOString() };
        await storageService.storeDID(updated);
        const stored = await storageService.getDID(testDID.id);
        expect(stored?.updated).toBe(updated.updated);
    });

    it('should delete a DID document', async () => {
        await storageService.storeDID(testDID);
        await storageService.deleteDID(testDID.id);
        const stored = await storageService.getDID(testDID.id);
        expect(stored).toBeNull();
    });

    it('should handle non-existent DID', async () => {
        const stored = await storageService.getDID('non-existent');
        expect(stored).toBeNull();
    });
}); 
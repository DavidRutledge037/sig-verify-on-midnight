import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { StorageService } from '../../src/services/storage';
import { Collection } from 'mongodb';

describe('StorageService', () => {
    let storageService: StorageService;
    let mockCollection: jest.Mocked<Collection>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Create mock collection
        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn()
        } as unknown as jest.Mocked<Collection>;

        // Initialize service
        storageService = new StorageService();
        (storageService as any).collection = mockCollection;
    });

    it('should store document', async () => {
        const doc = { id: 'test-id', content: 'test-content' };
        mockCollection.insertOne.mockResolvedValue({ insertedId: doc.id });

        await storageService.store(doc);
        expect(mockCollection.insertOne).toHaveBeenCalledWith(doc);
    });

    it('should retrieve document', async () => {
        const doc = { id: 'test-id', content: 'test-content' };
        mockCollection.findOne.mockResolvedValue(doc);

        const result = await storageService.get('test-id');
        expect(result).toEqual(doc);
    });

    // ... rest of tests remain the same ...
}); 
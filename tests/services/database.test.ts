import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DatabaseService } from '../../src/services/database';
import { MongoClient, Collection } from 'mongodb';

// Mock MongoDB
jest.mock('mongodb');

describe('DatabaseService', () => {
    let databaseService: DatabaseService;
    let mockCollection: jest.Mocked<Collection>;
    let mockClient: jest.Mocked<MongoClient>;

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

        // Create mock client
        mockClient = {
            connect: jest.fn(),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue(mockCollection)
            }),
            close: jest.fn()
        } as unknown as jest.Mocked<MongoClient>;

        // Initialize service
        databaseService = new DatabaseService('mongodb://localhost:27017', 'test-db');
        (databaseService as any).client = mockClient;
    });

    it('should connect to database', async () => {
        await databaseService.connect();
        expect(mockClient.connect).toHaveBeenCalled();
    });

    it('should get collection', async () => {
        const collection = await databaseService.getCollection('test');
        expect(collection).toBeDefined();
        expect(mockClient.db).toHaveBeenCalled();
    });

    // ... rest of tests remain the same, just using jest syntax ...
}); 
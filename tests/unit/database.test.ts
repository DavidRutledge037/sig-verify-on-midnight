import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DatabaseService } from '../../src/services/database';
import { MongoClient, Collection } from 'mongodb';

// Mock MongoDB
jest.mock('mongodb');

describe('Database Unit Tests', () => {
    let databaseService: DatabaseService;
    let mockClient: jest.Mocked<MongoClient>;
    let mockCollection: jest.Mocked<Collection>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn()
        } as unknown as jest.Mocked<Collection>;

        mockClient = {
            connect: jest.fn(),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue(mockCollection)
            }),
            close: jest.fn()
        } as unknown as jest.Mocked<MongoClient>;

        databaseService = new DatabaseService('mongodb://localhost:27017', 'test-db');
        (databaseService as any).client = mockClient;
    });

    it('should connect to database', async () => {
        await databaseService.connect();
        
        expect(mockClient.connect).toHaveBeenCalled();
        expect(mockClient.db).toHaveBeenCalledWith('test-db');
    });

    it('should get collection', async () => {
        const collection = await databaseService.getCollection('test-collection');
        
        expect(collection).toBeDefined();
        expect(mockClient.db).toHaveBeenCalled();
        expect(mockClient.db().collection).toHaveBeenCalledWith('test-collection');
    });

    it('should handle connection errors', async () => {
        mockClient.connect.mockRejectedValue(new Error('Connection failed'));
        
        await expect(databaseService.connect())
            .rejects.toThrow('Connection failed');
    });

    // ... rest of tests ...
}); 
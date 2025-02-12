import { jest } from '@jest/globals';
import { DatabaseService } from '../src/services/database';
import { Collection, Db, MongoClient } from 'mongodb';

describe('Database Service Tests', () => {
    let dbService: DatabaseService;
    let mockCollection: jest.Mocked<Collection>;
    let mockDb: Partial<Db>;
    let mockClient: Partial<MongoClient>;

    beforeEach(() => {
        // Setup collection mock with proper types
        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn()
        } as unknown as jest.Mocked<Collection>;

        // Setup database mock with proper types
        mockDb = {
            collection: jest.fn().mockReturnValue(mockCollection)
        };

        // Setup MongoDB client mock with proper types
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
    });

    it('should connect to database', async () => {
        await dbService.connect();
        expect(mockClient.connect).toHaveBeenCalled();
    });

    it('should disconnect from database', async () => {
        await dbService.disconnect();
        expect(mockClient.close).toHaveBeenCalled();
    });

    it('should get collection', async () => {
        const collection = await dbService.getCollection('test');
        expect(mockDb.collection).toHaveBeenCalledWith('test');
        expect(collection).toBe(mockCollection);
    });

    it('should handle connection errors', async () => {
        const error = new Error('Connection failed');
        mockClient.connect = jest.fn().mockRejectedValue(error);
        await expect(dbService.connect()).rejects.toThrow('Connection failed');
    });

    it('should handle disconnection errors', async () => {
        const error = new Error('Disconnection failed');
        mockClient.close = jest.fn().mockRejectedValue(error);
        await expect(dbService.disconnect()).rejects.toThrow('Disconnection failed');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

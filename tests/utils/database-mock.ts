import { jest } from '@jest/globals';
import { MongoClient, Db, Collection, Document } from 'mongodb';
import { DatabaseService } from '../../src/services/database.service';

// Create a properly typed mock collection
export const createMockCollection = <T extends Document>(): jest.Mocked<Partial<Collection<T>>> => ({
    insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
    findOne: jest.fn().mockResolvedValue(null),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([])
    })
});

// Create a properly typed mock db
export const createMockDb = (): jest.Mocked<Partial<Db>> => ({
    collection: jest.fn().mockImplementation((name: string) => createMockCollection())
});

// Create a properly typed mock client
export const createMockMongoClient = (): jest.Mocked<Partial<MongoClient>> => ({
    db: jest.fn().mockReturnValue(createMockDb()),
    connect: jest.fn().mockResolvedValue({} as MongoClient),
    close: jest.fn().mockResolvedValue()
});

// Create a properly typed mock database service
export const createMockDatabaseService = (): jest.Mocked<DatabaseService> => {
    const mockClient = createMockMongoClient();
    return {
        client: mockClient as MongoClient,
        connect: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined),
        getCollection: jest.fn().mockImplementation((name: string) => createMockCollection())
    } as jest.Mocked<DatabaseService>;
};

export interface DatabaseConfig {
    uri: string;
    dbName: string;
    options?: {
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
    };
}

// Update DatabaseClient mock
export class DatabaseClient {
    private client: MongoClient;
    
    constructor(config: DatabaseConfig) {
        this.client = createMockMongoClient() as MongoClient;
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async close(): Promise<void> {
        await this.client.close();
    }

    getClient(): MongoClient {
        return this.client;
    }
} 
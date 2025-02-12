import { Collection, Db, Document, MongoClient } from 'mongodb';
import { jest } from '@jest/globals';

export interface MockMongoCollection extends Partial<Collection> {
    insertOne: jest.Mock;
    findOne: jest.Mock;
    updateOne: jest.Mock;
    deleteOne: jest.Mock;
}

export interface MockMongoDb extends Partial<Db> {
    collection: jest.Mock;
}

export interface MockMongoClient extends Partial<MongoClient> {
    db: jest.Mock;
    connect: jest.Mock;
    close: jest.Mock;
}

export const createMockCollection = (): MockMongoCollection => ({
    insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
    findOne: jest.fn().mockResolvedValue(null),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
});

export const createMockDb = (mockCollection: MockMongoCollection): MockMongoDb => ({
    collection: jest.fn().mockReturnValue(mockCollection)
});

export const createMockClient = (mockDb: MockMongoDb): MockMongoClient => ({
    db: jest.fn().mockReturnValue(mockDb),
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined)
});

export const createMockMongoInfrastructure = () => {
    const mockCollection = createMockCollection();
    const mockDb = createMockDb(mockCollection);
    const mockClient = createMockClient(mockDb);
    return { mockCollection, mockDb, mockClient };
}; 
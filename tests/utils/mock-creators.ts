import { jest } from '@jest/globals';
import type { Collection, Db, MongoClient } from 'mongodb';
import type { DIDDocument } from '../../src/types/did.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import { createMockFn, createAsyncMockFn, createSyncMockFn } from './mock-functions.js';

// Create a properly typed mock collection
export function createMockCollection<T>(): jest.Mocked<Collection<T>> {
    return {
        insertOne: createAsyncMockFn({ insertedId: 'test-id' }),
        findOne: createAsyncMockFn(null),
        updateOne: createAsyncMockFn({ modifiedCount: 1 }),
        deleteOne: createAsyncMockFn({ deletedCount: 1 }),
        find: createSyncMockFn({
            toArray: createAsyncMockFn([])
        })
    } as unknown as jest.Mocked<Collection<T>>;
}

// Create a properly typed mock db
export function createMockDb(): jest.Mocked<Db> {
    return {
        collection: createMockFn(createMockCollection())
    } as unknown as jest.Mocked<Db>;
}

// Create a properly typed mock client
export function createMockMongoClient(): jest.Mocked<MongoClient> {
    return {
        db: createMockFn(createMockDb()),
        connect: createAsyncMockFn(undefined),
        close: createAsyncMockFn(undefined)
    } as unknown as jest.Mocked<MongoClient>;
}

// Create a properly typed mock fetch response
export function createMockFetchResponse<T>(data: T): Response {
    return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(data)
    } as unknown as Response;
}

// Create a properly typed mock error response
export function createMockErrorResponse(status = 404, statusText = 'Not Found'): Response {
    return {
        ok: false,
        status,
        statusText,
        json: () => Promise.reject(new Error(statusText))
    } as unknown as Response;
} 
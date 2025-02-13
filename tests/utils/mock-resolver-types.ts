import { jest } from '@jest/globals';
import type { DIDDocument, DIDResolutionResult } from '../../src/types/did.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import type { Collection, MongoClient } from 'mongodb';

// Define explicit return types for mock functions
export interface MockReturnTypes {
    // Void returns
    void: void;
    undefined: undefined;
    
    // Common types
    boolean: boolean;
    string: string;
    number: number;
    
    // Buffer types
    uint8Array: Uint8Array;
    buffer: Buffer;
    
    // Domain types
    keyPair: KeyPair;
    didDocument: DIDDocument;
    didResolution: DIDResolutionResult;
    
    // Database types
    collection: Collection<any>;
    mongoClient: MongoClient;
    
    // Response types
    insertResponse: { insertedId: string };
    updateResponse: { modifiedCount: number };
    deleteResponse: { deletedCount: number };
    
    // Transaction types
    transactionResponse: { transactionHash: string };
}

// Type-safe mock function creators
export type MockFnReturn<K extends keyof MockReturnTypes> = jest.MockedFunction<
    (...args: any[]) => Promise<MockReturnTypes[K]>
>;

export type SyncMockFnReturn<K extends keyof MockReturnTypes> = jest.MockedFunction<
    (...args: any[]) => MockReturnTypes[K]
>; 
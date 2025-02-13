import { jest } from '@jest/globals';
import type { DIDDocument, DIDResolutionResult } from '../../src/types/did.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import type { Collection, Db, MongoClient } from 'mongodb';

// Proper mock function types
export type MockFn<T extends (...args: any[]) => any> = jest.MockedFunction<T>;
export type AsyncMockFn<T> = MockFn<(...args: any[]) => Promise<T>>;
export type SyncMockFn<T> = MockFn<(...args: any[]) => T>;

// Service mock types
export interface MockedDIDService {
    createDID: AsyncMockFn<DIDDocument>;
    verifyDID: AsyncMockFn<boolean>;
    resolveDID: AsyncMockFn<DIDResolutionResult>;
    revokeDID: AsyncMockFn<boolean>;
    isValidDIDFormat: SyncMockFn<boolean>;
    addService: AsyncMockFn<boolean>;
}

export interface MockedStorageService {
    initialize: AsyncMockFn<void>;
    getDID: AsyncMockFn<DIDDocument | null>;
    storeDID: AsyncMockFn<boolean>;
    updateDID: AsyncMockFn<boolean>;
    deleteDID: AsyncMockFn<boolean>;
    exists: AsyncMockFn<boolean>;
    getDIDsByController: AsyncMockFn<DIDDocument[]>;
    getDIDsByStatus: AsyncMockFn<DIDDocument[]>;
}

export interface MockedWalletService {
    initialize: AsyncMockFn<void>;
    createWallet: AsyncMockFn<{ address: string }>;
    getClient: AsyncMockFn<any>;
    sign: AsyncMockFn<Uint8Array>;
    verify: AsyncMockFn<boolean>;
    getBalance: AsyncMockFn<string>;
    signMessage: AsyncMockFn<Uint8Array>;
    getPublicKey: SyncMockFn<Uint8Array>;
}

// Database mock types
export interface MockedCollection<T = any> extends Partial<Collection<T>> {
    insertOne: AsyncMockFn<{ insertedId: string }>;
    findOne: AsyncMockFn<T | null>;
    updateOne: AsyncMockFn<{ modifiedCount: number }>;
    deleteOne: AsyncMockFn<{ deletedCount: number }>;
    find: SyncMockFn<{ toArray: AsyncMockFn<T[]> }>;
}

export interface MockedDb extends Partial<Db> {
    collection: SyncMockFn<MockedCollection>;
}

export interface MockedMongoClient extends Partial<MongoClient> {
    connect: AsyncMockFn<void>;
    close: AsyncMockFn<void>;
    db: SyncMockFn<MockedDb>;
}

// Basic mock data
export const mockKeyPair: KeyPair = {
    publicKey: new Uint8Array([1, 2, 3]),
    privateKey: new Uint8Array([4, 5, 6])
};

export const mockDIDDocument: DIDDocument = {
    id: 'did:midnight:test123',
    controller: 'did:midnight:controller123',
    verificationMethod: [{
        id: 'did:midnight:test123#key-1',
        type: 'Ed25519VerificationKey2020',
        controller: 'did:midnight:test123',
        publicKeyHex: '123456'
    }],
    authentication: ['did:midnight:test123#key-1'],
    assertionMethod: ['did:midnight:test123#key-1'],
    created: new Date().toISOString(),
    updated: new Date().toISOString()
};

export const mockDIDResolution: DIDResolutionResult = {
    didDocument: mockDIDDocument,
    didResolutionMetadata: {
        contentType: 'application/did+json'
    },
    didDocumentMetadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    }
};

// Mock response types
export interface MockResponse<T = any> {
    ok: boolean;
    status: number;
    statusText: string;
    json(): Promise<T>;
}

// Mock collection types
export type MockedCollection<T> = jest.Mocked<Collection<T>>;
export type MockedDb = jest.Mocked<Db>;
export type MockedMongoClient = jest.Mocked<MongoClient>;

// Mock function types
export type MockedFunction<T extends (...args: any[]) => any> = jest.MockedFunction<T>;
export type MockedPromise<T> = jest.MockedFunction<() => Promise<T>>; 
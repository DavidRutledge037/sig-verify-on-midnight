import { jest } from '@jest/globals';
import type { DIDDocument, DIDResolutionResult } from '../../src/types/did.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import type { Collection } from 'mongodb';
import { createMockKeyPair, createMockDIDDocument } from './test-helpers.js';
import { createAsyncMock, createSyncMock, mockValues } from './mock-function-types.js';

/**
 * Type-safe mock resolvers for different service types
 */
export const mockResolvers = {
    // Key management mocks
    keyPair: () => createAsyncMock<KeyPair>(createMockKeyPair()),
    publicKey: () => createSyncMock<Uint8Array>(new Uint8Array([1, 2, 3])),
    privateKey: () => createSyncMock<Uint8Array>(new Uint8Array([4, 5, 6])),
    signature: () => createAsyncMock<Uint8Array>(new Uint8Array([7, 8, 9])),

    // DID related mocks
    didDocument: () => createAsyncMock<DIDDocument>(createMockDIDDocument()),
    didResolution: () => createAsyncMock<DIDResolutionResult>({
        didDocument: createMockDIDDocument(),
        didResolutionMetadata: {
            contentType: 'application/did+json',
            retrieved: new Date().toISOString(),
            duration: 100
        },
        didDocumentMetadata: {
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            status: 'active'
        }
    }),

    // Wallet related mocks
    wallet: () => createAsyncMock<{ address: string }>({ 
        address: 'midnight1test' 
    }),
    balance: () => createAsyncMock<string>('1000'),

    // Storage related mocks
    collection: <T>() => ({
        insertOne: jest.fn().mockResolvedValue({ 
            insertedId: 'test-id',
            acknowledged: true 
        }),
        findOne: jest.fn().mockResolvedValue(null),
        find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([])
        }),
        updateOne: jest.fn().mockResolvedValue({ 
            modifiedCount: 1,
            matchedCount: 1,
            acknowledged: true,
            upsertedCount: 0,
            upsertedId: null
        }),
        deleteOne: jest.fn().mockResolvedValue({ 
            deletedCount: 1,
            acknowledged: true
        })
    }) as jest.Mocked<Collection<T>>,

    // Transaction related mocks
    transaction: () => ({
        startTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        rollbackTransaction: jest.fn().mockResolvedValue(undefined),
        endSession: jest.fn().mockResolvedValue(undefined)
    }),

    // Verification related mocks
    verification: {
        success: () => createAsyncMock<boolean>(true),
        failure: () => createAsyncMock<boolean>(false)
    },

    // Common operation mocks
    operations: {
        success: () => createAsyncMock<boolean>(true),
        failure: () => createAsyncMock<boolean>(false),
        void: () => createAsyncMock<void>(undefined),
        error: (message: string) => createAsyncMock<never>(Promise.reject(new Error(message)))
    },

    // Database response mocks
    dbResponse: {
        insert: () => createAsyncMock(mockValues.insertResult),
        update: () => createAsyncMock(mockValues.updateResult),
        delete: () => createAsyncMock(mockValues.deleteResult),
        find: <T>() => createAsyncMock<T | null>(null),
        findMany: <T>() => createAsyncMock<T[]>([])
    }
};

/**
 * Creates a complete set of mocks for a given service
 */
export function createServiceMocks() {
    return {
        keyManager: {
            generateKeyPair: mockResolvers.keyPair(),
            sign: mockResolvers.signature(),
            verify: mockResolvers.verification.success(),
            getPublicKeyFromPrivate: mockResolvers.publicKey(),
            publicKeyToHex: jest.fn().mockReturnValue('test-public-key'),
            publicKeyFromHex: mockResolvers.publicKey()
        },
        walletService: {
            initialize: mockResolvers.operations.void(),
            createWallet: mockResolvers.wallet(),
            sign: mockResolvers.signature(),
            verify: mockResolvers.verification.success(),
            getBalance: mockResolvers.balance(),
            getPublicKey: mockResolvers.publicKey()
        },
        storageService: {
            initialize: mockResolvers.operations.void(),
            store: createAsyncMock<string>('test-id'),
            get: mockResolvers.dbResponse.find(),
            update: mockResolvers.operations.success(),
            delete: mockResolvers.operations.success()
        }
    };
} 
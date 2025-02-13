import { jest } from '@jest/globals';
import type { DIDDocument, DIDResolutionResult } from '../../src/types/did.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import type { Collection } from 'mongodb';

// Type-safe mock function creators
export function createMockFn<T extends (...args: any[]) => any>(
    implementation?: T
): jest.MockedFunction<T> {
    return jest.fn(implementation);
}

export function createAsyncMock<T>(returnValue: T): jest.MockedFunction<() => Promise<T>> {
    return jest.fn().mockResolvedValue(returnValue);
}

export function createSyncMock<T>(returnValue: T): jest.MockedFunction<() => T> {
    return jest.fn().mockReturnValue(returnValue);
}

// Common mock implementations
export const mockImplementations = {
    // Service mocks
    walletService: {
        initialize: createAsyncMock(undefined),
        createWallet: createAsyncMock({ address: 'midnight1test' }),
        getClient: createAsyncMock({
            signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
        }),
        sign: createAsyncMock(new Uint8Array([1, 2, 3])),
        verify: createAsyncMock(true),
        getBalance: createAsyncMock('1000'),
        signMessage: createAsyncMock(new Uint8Array([1, 2, 3])),
        getPublicKey: createSyncMock(new Uint8Array([1, 2, 3]))
    },

    // Database mocks
    collection: {
        insertOne: createAsyncMock({ insertedId: 'test-id' }),
        findOne: createAsyncMock(null),
        updateOne: createAsyncMock({ modifiedCount: 1 }),
        deleteOne: createAsyncMock({ deletedCount: 1 }),
        find: createSyncMock({
            toArray: createAsyncMock([])
        })
    } as Partial<Collection<any>>,

    // DID mocks
    didDocument: createAsyncMock<DIDDocument>({
        id: 'did:midnight:test',
        controller: 'did:midnight:test',
        verificationMethod: [{
            id: 'did:midnight:test#key-1',
            type: 'Ed25519VerificationKey2020',
            controller: 'did:midnight:test',
            publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
        }],
        authentication: ['did:midnight:test#key-1'],
        assertionMethod: ['did:midnight:test#key-1'],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    }),

    // Key mocks
    keyPair: createAsyncMock<KeyPair>({
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    })
}; 
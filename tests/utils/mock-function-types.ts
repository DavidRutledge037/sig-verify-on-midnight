import { jest } from '@jest/globals';
import type { DIDDocument, DIDResolutionResult } from '../../src/types/did.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import type { Collection } from 'mongodb';

/**
 * Creates a type-safe mock function with optional implementation
 */
export function createMockFn<T extends (...args: any[]) => any>(
    implementation?: T
): jest.MockedFunction<T> {
    return jest.fn(implementation);
}

/**
 * Creates a type-safe async mock function that returns a Promise
 */
export function createAsyncMock<T, Args extends any[] = any[]>(
    returnValue: T
): jest.MockedFunction<(...args: Args) => Promise<T>> {
    return jest.fn().mockResolvedValue(returnValue);
}

/**
 * Creates a type-safe sync mock function
 */
export function createSyncMock<T, Args extends any[] = any[]>(
    returnValue: T
): jest.MockedFunction<(...args: Args) => T> {
    return jest.fn().mockReturnValue(returnValue);
}

/**
 * Creates a type-safe error mock function
 */
export function createErrorMock<T extends Error>(
    error: T
): jest.MockedFunction<(...args: any[]) => never> {
    return jest.fn().mockImplementation(() => {
        throw error;
    });
}

/**
 * Common mock return values for consistent testing
 */
export const mockValues = {
    // DID related
    didDocument: {
        id: 'did:midnight:test',
        controller: 'did:midnight:test',
        verificationMethod: [],
        authentication: [],
        assertionMethod: [],
        keyAgreement: [],
        capabilityInvocation: [],
        capabilityDelegation: [],
        service: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    } as DIDDocument,

    didResolution: {
        didDocument: {} as DIDDocument,
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
    } as DIDResolutionResult,

    // Key related
    keyPair: {
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    } as KeyPair,

    // Common values
    signature: new Uint8Array([1, 2, 3]),
    message: new TextEncoder().encode('test message'),
    
    // Database responses
    insertResult: { insertedId: 'test-id' },
    updateResult: { modifiedCount: 1 },
    deleteResult: { deletedCount: 1 },
    
    // Common values
    balance: '1000',
    address: 'midnight1test',
    undefined: undefined as void
};

/**
 * Type-safe mock creators for common patterns
 */
export const createMocks = {
    asyncVoid: () => createAsyncMock<void>(undefined),
    asyncTrue: () => createAsyncMock<boolean>(true),
    asyncFalse: () => createAsyncMock<boolean>(false),
    syncTrue: () => createSyncMock<boolean>(true),
    syncFalse: () => createSyncMock<boolean>(false),
    collection: <T>() => ({
        insertOne: createAsyncMock(mockValues.insertResult),
        findOne: createAsyncMock<T | null>(null),
        updateOne: createAsyncMock(mockValues.updateResult),
        deleteOne: createAsyncMock(mockValues.deleteResult),
        find: createSyncMock({
            toArray: createAsyncMock<T[]>([])
        })
    }) as unknown as jest.Mocked<Collection<T>>,
    error: (message: string) => createErrorMock(new Error(message))
}; 
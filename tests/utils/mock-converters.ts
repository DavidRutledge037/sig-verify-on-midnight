import { jest } from '@jest/globals';
import type { DIDDocument, DIDResolutionResult } from '../../src/types/did.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import type { Collection } from 'mongodb';

// Convert vi.fn() to jest.fn() with proper typing
export function mockFn<T extends (...args: any[]) => any>(
    implementation?: T
): jest.MockedFunction<T> {
    return jest.fn(implementation);
}

// Convert vi.spyOn to jest.spyOn with proper typing
export function mockSpyOn<T extends object, K extends keyof T>(
    object: T,
    method: K
): jest.SpyInstance {
    return jest.spyOn(object, method);
}

// Convert mock implementations with proper typing
export function mockResolvedValue<T>(value: T) {
    return jest.fn().mockResolvedValue(value);
}

export function mockRejectedValue(error: Error) {
    return jest.fn().mockRejectedValue(error);
}

export function mockReturnValue<T>(value: T) {
    return jest.fn().mockReturnValue(value);
}

// Helper for collection mocks
export function createCollectionMock<T>(): jest.Mocked<Collection<T>> {
    return {
        insertOne: mockResolvedValue({ insertedId: 'test-id' }),
        findOne: mockResolvedValue(null),
        updateOne: mockResolvedValue({ modifiedCount: 1 }),
        deleteOne: mockResolvedValue({ deletedCount: 1 }),
        find: mockReturnValue({
            toArray: mockResolvedValue([])
        })
    } as unknown as jest.Mocked<Collection<T>>;
}

// Helper for common mock values
export const mockValues = {
    keyPair: (): KeyPair => ({
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    }),
    
    signature: () => new Uint8Array([1, 2, 3]),
    
    didDocument: (id = 'did:midnight:test'): DIDDocument => ({
        id,
        controller: id,
        verificationMethod: [{
            id: `${id}#key-1`,
            type: 'Ed25519VerificationKey2020',
            controller: id,
            publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
        }],
        authentication: [`${id}#key-1`],
        assertionMethod: [`${id}#key-1`],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    })
}; 
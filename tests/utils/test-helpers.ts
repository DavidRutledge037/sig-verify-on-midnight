import { randomBytes } from 'crypto';
import type { DIDDocument } from '../../src/types/did.types.js';
import type { KeyPair } from '../../src/types/key.types.js';
import { DatabaseConfig } from './database-mock.js';

/**
 * Creates a mock DID document with all required fields
 */
export function createMockDIDDocument(id = 'did:midnight:test'): DIDDocument {
    const now = new Date().toISOString();
    const keyId = `${id}#key-1`;
    
    return {
        id,
        controller: id,
        verificationMethod: [{
            id: keyId,
            type: 'Ed25519VerificationKey2020',
            controller: id,
            publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
        }],
        authentication: [keyId],
        assertionMethod: [keyId],
        keyAgreement: [keyId],
        capabilityInvocation: [keyId],
        capabilityDelegation: [keyId],
        service: [],
        created: now,
        updated: now
    };
}

/**
 * Creates a mock key pair with consistent test values
 */
export function createMockKeyPair(): KeyPair {
    return {
        publicKey: new Uint8Array([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
        ]),
        privateKey: new Uint8Array([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
            33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
            49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
        ])
    };
}

/**
 * Creates a mock verification method
 */
export function createMockVerificationMethod(
    didId: string,
    keyId = 'key-1',
    type = 'Ed25519VerificationKey2020'
) {
    return {
        id: `${didId}#${keyId}`,
        type,
        controller: didId,
        publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
    };
}

/**
 * Creates a mock DID resolution result
 */
export function createMockDIDResolutionResult(didDocument: DIDDocument) {
    return {
        didDocument,
        didResolutionMetadata: {
            contentType: 'application/did+json',
            retrieved: new Date().toISOString(),
            duration: 100
        },
        didDocumentMetadata: {
            created: didDocument.created,
            updated: didDocument.updated,
            status: 'active'
        }
    };
}

/**
 * Creates a mock wallet with consistent test values
 */
export function createMockWallet(address = 'midnight1test') {
    return {
        address,
        publicKey: createMockKeyPair().publicKey,
        balance: '1000'
    };
}

/**
 * Creates a mock signature for testing
 */
export function createMockSignature(): Uint8Array {
    return new Uint8Array(Array(64).fill(1));
}

/**
 * Creates a mock message for testing
 */
export function createMockMessage(text = 'test message'): Uint8Array {
    return new TextEncoder().encode(text);
}

/**
 * Utility to wait for a specified time
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Type guard for error objects
 */
export function isError(error: unknown): error is Error {
    return error instanceof Error;
}

// Standard test configuration
export const defaultConfig: DatabaseConfig = {
    uri: 'mongodb://localhost:27017',
    dbName: 'test_db',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

export const createMockProof = (creator: string = randomBytes(20).toString('hex')) => ({
    type: 'TestProof',
    created: new Date().toISOString(),
    creator,
    signatureValue: new Uint8Array(randomBytes(64)),
    data: {
        test: 'data'
    }
});

export const waitForTimeout = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms)); 
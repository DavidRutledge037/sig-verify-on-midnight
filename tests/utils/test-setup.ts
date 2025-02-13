import { jest } from '@jest/globals';
import { DIDDocument, VerificationMethod } from '../../src/types/did.types.js';
import { KeyPair } from '../../src/types/key.types.js';
import { TransactionDetails } from '../../src/types/transaction.types.js';
import { DatabaseConfig } from './database-mock.js';
import { createTypedMock, createAsyncMock, createSyncMock } from './mock-functions.js';

// Standard test configuration
export const TEST_CONFIG = {
    mongoUri: 'mongodb://localhost:27017',
    dbName: 'test_db',
    chainId: 'test-chain-1',
    rpcUrl: 'http://localhost:26657'
};

// Standard database configuration
export const TEST_DB_CONFIG: DatabaseConfig = {
    uri: TEST_CONFIG.mongoUri,
    dbName: TEST_CONFIG.dbName,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

// Mock verification method with proper types
export const createMockVerificationMethod = (id: string): VerificationMethod => ({
    id: `${id}#key-1`,
    type: 'Ed25519VerificationKey2020',
    controller: id,
    publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK' // Using multibase instead of hex
});

// Mock DID document with proper types
export const createMockDIDDocument = (id: string): DIDDocument => ({
    id,
    controller: id,
    verificationMethod: [createMockVerificationMethod(id)],
    authentication: [`${id}#key-1`],
    assertionMethod: [`${id}#key-1`],
    created: new Date().toISOString(),
    updated: new Date().toISOString()
});

// Mock transaction details with proper types
export const createMockTransactionDetails = (hash: string): TransactionDetails => ({
    hash,
    height: BigInt(1000),
    index: 0,
    proof: {
        type: 'Ed25519Signature2020',
        created: new Date().toISOString(),
        verificationMethod: 'did:midnight:test#key-1',
        proofValue: 'z1234567890'
    }
});

// Mock key pair with proper types
export const createMockKeyPair = (): KeyPair => ({
    publicKey: new Uint8Array([1, 2, 3]),
    privateKey: new Uint8Array([4, 5, 6])
});

// Helper to create mock fetch responses
export const createMockFetchResponse = <T>(data: T) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(data)
}); 
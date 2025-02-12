import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';
import type { webcrypto } from 'node:crypto';
import { Collection, Db, Document } from 'mongodb';
import { DatabaseService } from './src/services/database';

type SubtleCrypto = webcrypto.SubtleCrypto;
type Crypto = webcrypto.Crypto;
type CryptoKey = webcrypto.CryptoKey;
type UUID = `${string}-${string}-${string}-${string}-${string}`;

// Define MongoDB result types
type InsertOneResult = { acknowledged: boolean; insertedId: string };
type UpdateResult = { acknowledged: boolean; modifiedCount: number };
type DeleteResult = { acknowledged: boolean; deletedCount: number };

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Create base mock functions
class MockCryptoKey implements CryptoKey {
    readonly type: KeyType = 'secret';
    readonly extractable: boolean = true;
    readonly algorithm: KeyAlgorithm = { name: 'HMAC' };
    readonly usages: KeyUsage[] = ['sign', 'verify'];
}

// Define function types explicitly
type DecryptFunction = (algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: CryptoKey, data: BufferSource) => Promise<ArrayBuffer>;
type DeriveBitsFunction = (algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params, baseKey: CryptoKey, length: number) => Promise<ArrayBuffer>;
type DeriveKeyFunction = (algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params, baseKey: CryptoKey, derivedKeyType: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[]) => Promise<CryptoKey>;
type DigestFunction = (algorithm: AlgorithmIdentifier, data: BufferSource) => Promise<ArrayBuffer>;
type EncryptFunction = (algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: CryptoKey, data: BufferSource) => Promise<ArrayBuffer>;
type ExportKeyFunction = (format: KeyFormat, key: CryptoKey) => Promise<JsonWebKey | ArrayBuffer>;
type GenerateKeyFunction = (algorithm: AlgorithmIdentifier | RsaHashedKeyGenParams | EcKeyGenParams, extractable: boolean, keyUsages: KeyUsage[]) => Promise<CryptoKey | CryptoKeyPair>;
type ImportKeyFunction = (format: KeyFormat, keyData: BufferSource | JsonWebKey, algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm, extractable: boolean, keyUsages: KeyUsage[]) => Promise<CryptoKey>;
type SignFunction = (algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams, key: CryptoKey, data: BufferSource) => Promise<ArrayBuffer>;
type UnwrapKeyFunction = (format: KeyFormat, wrappedKey: BufferSource, unwrappingKey: CryptoKey, unwrapAlgorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, unwrappedKeyAlgorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[]) => Promise<CryptoKey>;
type VerifyFunction = (algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams, key: CryptoKey, signature: BufferSource, data: BufferSource) => Promise<boolean>;
type WrapKeyFunction = (format: KeyFormat, key: CryptoKey, wrappingKey: CryptoKey, wrapAlgorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams) => Promise<ArrayBuffer>;

// Create mock SubtleCrypto with explicit return types
const mockSubtle = {
    decrypt: jest.fn<(...args: any[]) => Promise<ArrayBuffer>>()
        .mockResolvedValue(new ArrayBuffer(0)),
        
    deriveBits: jest.fn<(...args: any[]) => Promise<ArrayBuffer>>()
        .mockResolvedValue(new ArrayBuffer(0)),
        
    deriveKey: jest.fn<(...args: any[]) => Promise<CryptoKey>>()
        .mockResolvedValue(new MockCryptoKey()),
        
    digest: jest.fn<(...args: any[]) => Promise<ArrayBuffer>>()
        .mockResolvedValue(new ArrayBuffer(32)),
        
    encrypt: jest.fn<(...args: any[]) => Promise<ArrayBuffer>>()
        .mockResolvedValue(new ArrayBuffer(0)),
        
    exportKey: jest.fn<(...args: any[]) => Promise<JsonWebKey | ArrayBuffer>>()
        .mockImplementation(async (format: KeyFormat) => {
            if (format === 'jwk') {
                return {
                    kty: 'oct',
                    k: 'test',
                    alg: 'HS256',
                    ext: true,
                    key_ops: ['sign', 'verify']
                };
            }
            return new ArrayBuffer(0);
        }),
        
    generateKey: jest.fn<(...args: any[]) => Promise<CryptoKey | CryptoKeyPair>>()
        .mockImplementation(async (algorithm: AlgorithmIdentifier) => {
            const key = new MockCryptoKey();
            return typeof algorithm === 'string' || (algorithm as any).name === 'HMAC'
                ? key
                : { publicKey: key, privateKey: key };
        }),
        
    importKey: jest.fn<(...args: any[]) => Promise<CryptoKey>>()
        .mockResolvedValue(new MockCryptoKey()),
        
    sign: jest.fn<(...args: any[]) => Promise<ArrayBuffer>>()
        .mockResolvedValue(new ArrayBuffer(64)),
        
    unwrapKey: jest.fn<(...args: any[]) => Promise<CryptoKey>>()
        .mockResolvedValue(new MockCryptoKey()),
        
    verify: jest.fn<(...args: any[]) => Promise<boolean>>()
        .mockResolvedValue(true),
        
    wrapKey: jest.fn<(...args: any[]) => Promise<ArrayBuffer>>()
        .mockResolvedValue(new ArrayBuffer(0))
} as SubtleCrypto;

// Create complete Response mock with bytes method
class MockResponse implements Response {
    readonly ok = true;
    readonly redirected = false;
    readonly status = 200;
    readonly statusText = 'OK';
    readonly type = 'default' as ResponseType;
    readonly url = '';
    readonly body = null;
    readonly bodyUsed = false;
    readonly headers = new Headers();

    async arrayBuffer(): Promise<ArrayBuffer> { return new ArrayBuffer(0); }
    async blob(): Promise<Blob> { return new Blob(); }
    clone(): Response { return Object.create(this); }
    async formData(): Promise<FormData> { return new FormData(); }
    async json(): Promise<any> { return {}; }
    async text(): Promise<string> { return ''; }
    async bytes(): Promise<Uint8Array> { return new Uint8Array(0); }
}

const mockFetchResponse = new MockResponse();
const mockFetch = jest.fn<typeof fetch>().mockResolvedValue(mockFetchResponse);
global.fetch = mockFetch;

// Create properly typed collection methods
const insertOne = jest.fn<() => Promise<InsertOneResult>>()
    .mockResolvedValue({ acknowledged: true, insertedId: 'test' });

const findOne = jest.fn<() => Promise<Document | null>>()
    .mockResolvedValue(null);

const updateOne = jest.fn<() => Promise<UpdateResult>>()
    .mockResolvedValue({ acknowledged: true, modifiedCount: 1 });

const deleteOne = jest.fn<() => Promise<DeleteResult>>()
    .mockResolvedValue({ acknowledged: true, deletedCount: 1 });

const find = jest.fn().mockReturnValue({
    toArray: jest.fn<() => Promise<Document[]>>().mockResolvedValue([]),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
});

// Create mock collection
const mockCollection = {
    insertOne,
    findOne,
    updateOne,
    deleteOne,
    find
} as unknown as Collection;

const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection)
} as unknown as Db;

// Create mock database service
const mockDatabaseService = {
    connect: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    disconnect: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    getCollection: jest.fn<() => Promise<Collection>>().mockResolvedValue(mockCollection),
    db: mockDb
};

// Create properly typed getRandomValues
const mockGetRandomValues = function<T extends Exclude<NodeJS.TypedArray, Float32Array | Float64Array>>(array: T): T {
    const bytes = new Uint8Array(array.buffer);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
    }
    return array;
};

const CryptoKeyConstructor = {
    prototype: MockCryptoKey.prototype,
    [Symbol.hasInstance](instance: any): boolean {
        return instance instanceof MockCryptoKey;
    }
} as webcrypto.CryptoKeyConstructor;

const mockCrypto: Crypto = {
    subtle: mockSubtle,
    getRandomValues: mockGetRandomValues,
    randomUUID: () => '00000000-0000-0000-0000-000000000000' as UUID,
    CryptoKey: CryptoKeyConstructor
};

Object.defineProperty(global, 'crypto', {
    value: mockCrypto,
    writable: true,
    enumerable: true,
    configurable: true
});

// Mock node:crypto
const realCrypto = jest.requireActual<typeof import('crypto')>('crypto');
const mockNodeCrypto = {
    ...realCrypto,
    randomBytes: (size: number) => {
        const arr = new Uint8Array(size);
        mockGetRandomValues(arr);
        return Buffer.from(arr);
    },
    createHash: realCrypto.createHash,
    webcrypto: mockCrypto
};

jest.mock('crypto', () => mockNodeCrypto);

// Increase timeout for all tests
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Add custom matchers if needed
expect.extend({
    toBeValidDID(received) {
        const pass = received.startsWith('did:midnight:');
        return {
            pass,
            message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid DID`
        };
    }
});

// Add global test environment setup
process.env.NODE_ENV = 'test';

// Make mock database service available globally
Object.defineProperty(global, 'databaseService', {
    value: mockDatabaseService,
    writable: true,
    enumerable: true,
    configurable: true
});
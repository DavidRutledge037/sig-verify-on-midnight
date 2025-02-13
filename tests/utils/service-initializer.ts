import { jest } from '@jest/globals';
import { DIDService } from '../../src/services/did.service.js';
import { DIDStorageService } from '../../src/services/did-storage.service.js';
import { WalletService } from '../../src/services/wallet.service.js';
import { DatabaseService } from '../../src/services/database.service.js';
import { KeyManager } from '../../src/identity/keys.js';
import { createMockKeyPair } from './test-helpers.js';
import { createMockCollection, createMockDb } from './mock-creators.js';
import { createTypedMock, createAsyncMockFn, createSyncMockFn } from './mock-functions.js';

// Initialize a properly typed mock wallet service
export function initializeMockWalletService(): jest.Mocked<WalletService> {
    const keyManager = new KeyManager();
    const mockKeyPair = createMockKeyPair();
    
    const service = {
        keyManager,
        wallet: null,
        client: null,
        currentKeyPair: mockKeyPair,
        initialize: createAsyncMockFn(undefined),
        createWallet: createAsyncMockFn({ address: 'midnight1test' }),
        getClient: createAsyncMockFn({
            signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
        }),
        sign: createAsyncMockFn(new Uint8Array([1, 2, 3])),
        verify: createAsyncMockFn(true),
        getBalance: createAsyncMockFn('1000'),
        signMessage: createAsyncMockFn(new Uint8Array([1, 2, 3])),
        getPublicKey: createSyncMockFn(new Uint8Array([1, 2, 3]))
    } as WalletService;

    return jest.mocked(service);
}

// Initialize a properly typed mock storage service
export function initializeMockStorageService(): jest.Mocked<DIDStorageService> {
    const mockDb = createMockDb();
    const mockCollection = createMockCollection();
    
    const service = {
        COLLECTION_NAME: 'dids',
        collection: mockCollection,
        dbService: {
            client: mockDb,
            connect: createAsyncMockFn(undefined),
            disconnect: createAsyncMockFn(undefined),
            getCollection: createSyncMockFn(mockCollection)
        } as DatabaseService,
        initialize: createAsyncMockFn(undefined),
        getDID: createAsyncMockFn(null),
        storeDID: createAsyncMockFn(true),
        updateDID: createAsyncMockFn(true),
        deleteDID: createAsyncMockFn(true),
        exists: createAsyncMockFn(true)
    } as DIDStorageService;

    return jest.mocked(service);
}

// Initialize a properly typed mock DID service
export function initializeMockDIDService(): jest.Mocked<DIDService> {
    const walletService = initializeMockWalletService();
    
    const service = new DIDService(walletService);
    service.createDID = createAsyncMockFn({ id: 'did:midnight:test' });
    service.verifyDID = createAsyncMockFn(true);
    service.resolveDID = createAsyncMockFn({ 
        didDocument: { id: 'did:midnight:test' },
        didResolutionMetadata: { contentType: 'application/did+json' },
        didDocumentMetadata: { created: new Date().toISOString() }
    });
    
    return jest.mocked(service);
} 
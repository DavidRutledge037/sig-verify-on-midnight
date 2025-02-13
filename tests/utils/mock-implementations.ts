import { jest } from '@jest/globals';
import { Collection, Db, MongoClient } from 'mongodb';
import { DIDDocument } from '../../src/types/did.types';
import { KeyPair } from '../../src/types/key.types';
import { DIDService } from '../../src/services/did.service';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { WalletService } from '../../src/services/wallet.service';
import { DatabaseService } from '../../src/services/database.service';
import { mockKeyPair, mockDIDDocument } from './mock-types';
import { createMockFn, createAsyncMockFn } from './mock-utils';

// Mock DID Service Implementation
export const mockDIDServiceImpl: jest.Mocked<DIDService> = {
    didManager: {} as any,
    walletService: {} as WalletService,
    createDID: jest.fn().mockResolvedValue(mockDIDDocument),
    verifyDID: jest.fn().mockResolvedValue(true),
    resolveDID: jest.fn().mockResolvedValue({
        didDocument: mockDIDDocument,
        didResolutionMetadata: { contentType: 'application/did+json' },
        didDocumentMetadata: { created: new Date().toISOString() }
    }),
    revokeDID: jest.fn().mockResolvedValue(true),
    isValidDIDFormat: jest.fn().mockReturnValue(true),
    addService: jest.fn().mockResolvedValue(true)
} as jest.Mocked<DIDService>;

// Mock Storage Service Implementation
export const mockStorageServiceImpl: jest.Mocked<DIDStorageService> = {
    COLLECTION_NAME: 'dids',
    collection: {} as Collection<DIDDocument>,
    dbService: {} as DatabaseService,
    initialize: jest.fn().mockResolvedValue(undefined),
    getDID: jest.fn().mockResolvedValue(mockDIDDocument),
    storeDID: jest.fn().mockResolvedValue(true),
    updateDID: jest.fn().mockResolvedValue(true),
    deleteDID: jest.fn().mockResolvedValue(true),
    getDIDsByController: jest.fn().mockResolvedValue([mockDIDDocument]),
    getDIDsByStatus: jest.fn().mockResolvedValue([mockDIDDocument]),
    exists: jest.fn().mockResolvedValue(true)
} as jest.Mocked<DIDStorageService>;

// Mock Wallet Service Implementation
export const mockWalletServiceImpl: jest.Mocked<WalletService> = {
    keyManager: {} as any,
    wallet: null,
    client: null,
    currentKeyPair: null,
    initialize: jest.fn().mockResolvedValue(undefined),
    createWallet: jest.fn().mockResolvedValue({ address: 'midnight1test123' }),
    getClient: jest.fn().mockResolvedValue({
        signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
    }),
    sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    verify: jest.fn().mockResolvedValue(true),
    getBalance: jest.fn().mockResolvedValue('1000'),
    signMessage: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    getPublicKey: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3]))
} as jest.Mocked<WalletService>;

// Mock Database Service Implementation
export const mockDatabaseServiceImpl: jest.Mocked<DatabaseService> = {
    client: {} as MongoClient,
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    getCollection: jest.fn().mockResolvedValue({} as Collection<any>)
} as jest.Mocked<DatabaseService>;

// Mock implementations for fetch responses
export const mockFetchImpl = {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: jest.fn().mockResolvedValue({})
}; 
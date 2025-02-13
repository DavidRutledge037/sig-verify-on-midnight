import { jest } from '@jest/globals';
import { createMockFn, createAsyncMockFn, mockResolvedValue, mockReturnValue } from './mock-utils';
import { DIDService } from '../../src/services/did.service.js';
import { DIDStorageService } from '../../src/services/did-storage.service.js';
import { WalletService } from '../../src/services/wallet.service.js';
import { DatabaseService } from '../../src/services/database.service.js';
import { KeyManager } from '../../src/identity/keys.js';
import { DIDDocument } from '../../src/types/did.types';
import { KeyPair } from '../../src/types/key.types';
import { createMockKeyPair } from './test-helpers.js';
import { createMockCollection, createMockDb } from './mock-creators.js';
import { mockResolvers } from './mock-resolver.js';
import type { MockFnReturn, SyncMockFnReturn } from './mock-resolver-types.js';

export const createMockDIDService = (): jest.Mocked<DIDService> => ({
    didManager: undefined,
    walletService: undefined,
    createDID: createAsyncMockFn<DIDService['createDID']>(),
    verifyDID: createAsyncMockFn<DIDService['verifyDID']>(),
    resolveDID: createAsyncMockFn<DIDService['resolveDID']>(),
    revokeDID: createAsyncMockFn<DIDService['revokeDID']>(),
    isValidDIDFormat: createMockFn<DIDService['isValidDIDFormat']>(),
    addService: createAsyncMockFn<DIDService['addService']>()
});

export const createMockStorageService = (): jest.Mocked<DIDStorageService> => ({
    COLLECTION_NAME: 'dids',
    collection: undefined,
    dbService: undefined,
    initialize: createAsyncMockFn<DIDStorageService['initialize']>(),
    getDID: createAsyncMockFn<DIDStorageService['getDID']>(),
    storeDID: createAsyncMockFn<DIDStorageService['storeDID']>(),
    updateDID: createAsyncMockFn<DIDStorageService['updateDID']>(),
    deleteDID: createAsyncMockFn<DIDStorageService['deleteDID']>(),
    getDIDsByController: createAsyncMockFn<DIDStorageService['getDIDsByController']>(),
    getDIDsByStatus: createAsyncMockFn<DIDStorageService['getDIDsByStatus']>(),
    exists: createAsyncMockFn<DIDStorageService['exists']>()
});

export const createMockWalletService = (): jest.Mocked<WalletService> => ({
    keyManager: undefined,
    wallet: undefined,
    client: undefined,
    currentKeyPair: undefined,
    initialize: createAsyncMockFn<WalletService['initialize']>(),
    createWallet: createAsyncMockFn<WalletService['createWallet']>(),
    getClient: createAsyncMockFn<WalletService['getClient']>(),
    sign: createAsyncMockFn<WalletService['sign']>(),
    verify: createAsyncMockFn<WalletService['verify']>(),
    getBalance: createAsyncMockFn<WalletService['getBalance']>(),
    signMessage: createAsyncMockFn<WalletService['signMessage']>(),
    getPublicKey: createMockFn<WalletService['getPublicKey']>()
});

export const createMockKeyManager = (): jest.Mocked<KeyManager> => ({
    generateKeyPair: createAsyncMockFn<KeyManager['generateKeyPair']>(),
    sign: createAsyncMockFn<KeyManager['sign']>(),
    verify: createAsyncMockFn<KeyManager['verify']>(),
    deriveAddress: createMockFn<KeyManager['deriveAddress']>(),
    getPublicKeyFromPrivate: createMockFn<KeyManager['getPublicKeyFromPrivate']>(),
    publicKeyToHex: createMockFn<KeyManager['publicKeyToHex']>(),
    publicKeyFromHex: createMockFn<KeyManager['publicKeyFromHex']>()
});

export function createMockWalletService(): jest.Mocked<WalletService> {
    const mockKeyPair = createMockKeyPair();
    const service = {
        keyManager: new KeyManager(),
        wallet: null,
        client: null,
        currentKeyPair: mockKeyPair,
        initialize: mockResolvers.undefined(),
        createWallet: mockResolvers.wallet(),
        getClient: mockResolvers.client(),
        sign: mockResolvers.signature(),
        verify: mockResolvers.verification(),
        getBalance: mockResolvers.balance(),
        signMessage: mockResolvers.signature(),
        getPublicKey: mockResolvers.publicKey(),
        isInitialized: mockResolvers.verification(),
        getAddress: mockResolvers.address(),
        displayBalance: mockResolvers.balance()
    } as const;

    return service as unknown as jest.Mocked<WalletService>;
}

export function createMockStorageService(): jest.Mocked<DIDStorageService> {
    const mockDb = createMockCollection();
    const service = {
        COLLECTION_NAME: 'dids',
        collection: mockDb,
        dbService: {
            client: null,
            connect: mockResolvers.undefined(),
            disconnect: mockResolvers.undefined(),
            getCollection: mockResolvers.collection()
        } as DatabaseService,
        initialize: mockResolvers.undefined(),
        getDID: mockResolvers.didDocument(),
        storeDID: mockResolvers.verification(),
        updateDID: mockResolvers.verification(),
        deleteDID: mockResolvers.verification(),
        exists: mockResolvers.verification(),
        getDIDsByController: mockResolvers.didDocuments(),
        getDIDsByStatus: mockResolvers.didDocuments()
    } as const;

    return service as unknown as jest.Mocked<DIDStorageService>;
}

export function createMockDIDService(): jest.Mocked<DIDService> {
    const service = {
        didManager: {} as any,
        walletService: createMockWalletService(),
        createDID: mockResolvers.didDocument(),
        verifyDID: mockResolvers.verification(),
        resolveDID: mockResolvers.didResolution(),
        revokeDID: mockResolvers.verification(),
        isValidDIDFormat: mockResolvers.verification(),
        addService: mockResolvers.verification()
    } as const;

    return service as unknown as jest.Mocked<DIDService>;
} 
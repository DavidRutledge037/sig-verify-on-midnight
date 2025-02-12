import { jest } from '@jest/globals';
import { IKeyManager } from '../../src/types/interfaces/key.interface';
import { IWalletService, IWalletClient } from '../../src/types/interfaces/wallet.interface';
import { IDIDService } from '../../src/types/interfaces/did.interface';
import { IStorage } from '../../src/types/interfaces/storage.interface';
import { KeyPair } from '../../src/types/key.types';
import { DIDDocument } from '../../src/types/did.types';

export const createMockKeyPair = (): KeyPair => ({
    publicKey: new Uint8Array([1, 2, 3]),
    privateKey: new Uint8Array([4, 5, 6])
});

export const createMockKeyManager = (): jest.Mocked<IKeyManager> => ({
    generateKeyPair: jest.fn().mockResolvedValue(createMockKeyPair()),
    sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    verify: jest.fn().mockResolvedValue(true),
    deriveAddress: jest.fn().mockReturnValue('midnight1test123'),
    getPublicKeyFromPrivate: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
    publicKeyToHex: jest.fn().mockReturnValue('123456'),
    publicKeyFromHex: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3]))
});

export const createMockWalletClient = (): jest.Mocked<IWalletClient> => ({
    signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
});

export const createMockWalletService = (): jest.Mocked<IWalletService> => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    isInitialized: jest.fn().mockReturnValue(true),
    createWallet: jest.fn().mockResolvedValue(undefined),
    getClient: jest.fn().mockResolvedValue(createMockWalletClient()),
    getAddress: jest.fn().mockReturnValue('midnight1test123'),
    sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    verify: jest.fn().mockResolvedValue(true),
    signMessage: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    getBalance: jest.fn().mockResolvedValue('1000'),
    displayBalance: jest.fn().mockReturnValue('1.0 NIGHT'),
    getPublicKey: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
    getCurrentKeyPair: jest.fn().mockReturnValue(createMockKeyPair())
});

export const createMockStorage = <T>(): jest.Mocked<IStorage<T>> => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    isInitialized: jest.fn().mockReturnValue(true),
    getCollection: jest.fn().mockReturnValue({}),
    exists: jest.fn().mockResolvedValue(true),
    get: jest.fn().mockResolvedValue(null),
    store: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true)
});

export const createMockDIDService = (): jest.Mocked<IDIDService> => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    isInitialized: jest.fn().mockReturnValue(true),
    createDID: jest.fn().mockResolvedValue({} as DIDDocument),
    verifyDID: jest.fn().mockResolvedValue(true),
    resolveDID: jest.fn().mockResolvedValue({
        didDocument: {} as DIDDocument,
        didResolutionMetadata: { contentType: 'application/did+json' },
        didDocumentMetadata: { created: new Date().toISOString() }
    }),
    revokeDID: jest.fn().mockResolvedValue(true),
    isValidDIDFormat: jest.fn().mockReturnValue(true)
}); 
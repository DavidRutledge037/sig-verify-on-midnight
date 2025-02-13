import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { IKeyManager } from '../../src/types/interfaces/key.interface';
import { IWalletService, IWalletClient } from '../../src/types/interfaces/wallet.interface';
import { IDIDService } from '../../src/types/interfaces/did.interface';
import { IStorage } from '../../src/types/interfaces/storage.interface';
import { KeyPair } from '../../src/types/key.types';
import { DIDDocument } from '../../src/types/did.types';
import { DIDService } from '../../src/services/did.service';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { WalletService } from '../../src/services/wallet.service';
import { DatabaseService } from '../../src/services/database.service';

export const createMockKeyPair = (): KeyPair => ({
    publicKey: new Uint8Array([1, 2, 3]),
    privateKey: new Uint8Array([4, 5, 6])
});

type MockedFunction<T extends (...args: any[]) => any> = Mock<T>;

export const createMockKeyManager = (): jest.Mocked<IKeyManager> => ({
    generateKeyPair: jest.fn<() => Promise<KeyPair>>().mockResolvedValue(createMockKeyPair()),
    sign: jest.fn<() => Promise<Uint8Array>>().mockResolvedValue(new Uint8Array([1, 2, 3])),
    verify: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
    deriveAddress: jest.fn<() => string>().mockReturnValue('midnight1test123'),
    getPublicKeyFromPrivate: jest.fn<() => Uint8Array>().mockReturnValue(new Uint8Array([1, 2, 3])),
    publicKeyToHex: jest.fn<() => string>().mockReturnValue('123456'),
    publicKeyFromHex: jest.fn<() => Uint8Array>().mockReturnValue(new Uint8Array([1, 2, 3]))
});

export const createMockWalletClient = (): jest.Mocked<IWalletClient> => ({
    signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
});

export const createMockWalletService = (): jest.Mocked<WalletService> => {
    const service = {
        keyManager: undefined,
        wallet: undefined,
        client: undefined,
        currentKeyPair: undefined,
        initialize: jest.fn(),
        createWallet: jest.fn(),
        getClient: jest.fn(),
        sign: jest.fn(),
        verify: jest.fn(),
        getBalance: jest.fn(),
        signMessage: jest.fn(),
        getPublicKey: jest.fn()
    };
    return service as jest.Mocked<WalletService>;
};

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

export const createMockDIDService = (): jest.Mocked<DIDService> => {
    const service = {
        didManager: undefined,
        walletService: undefined,
        createDID: jest.fn(),
        verifyDID: jest.fn(),
        resolveDID: jest.fn(),
        revokeDID: jest.fn(),
        isValidDIDFormat: jest.fn(),
        addService: jest.fn()
    };
    return service as jest.Mocked<DIDService>;
};

export const createMockStorageService = (): jest.Mocked<DIDStorageService> => {
    const service = {
        COLLECTION_NAME: 'dids',
        collection: undefined,
        dbService: undefined,
        initialize: jest.fn(),
        getDID: jest.fn(),
        storeDID: jest.fn(),
        updateDID: jest.fn(),
        deleteDID: jest.fn(),
        getDIDsByController: jest.fn(),
        getDIDsByStatus: jest.fn(),
        exists: jest.fn()
    };
    return service as jest.Mocked<DIDStorageService>;
};

export const createMockDatabaseService = (): jest.Mocked<DatabaseService> => {
    const service = {
        client: undefined,
        connect: jest.fn(),
        disconnect: jest.fn(),
        getCollection: jest.fn()
    };
    return service as jest.Mocked<DatabaseService>;
}; 
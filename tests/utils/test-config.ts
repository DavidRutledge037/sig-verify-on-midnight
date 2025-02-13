import type { MongoClient, Collection, ClientSession } from 'mongodb';
import type { Container } from '../../src/core/container.js';
import type { IUnitOfWork } from '../../src/core/repository.js';
import type { 
    TestConfig, 
    MockServices, 
    MockDatabase,
    MockRepositories,
    TestEnvironment 
} from './test-config.types.js';
import { createMockFn, createAsyncMock } from './mock-function-types.js';
import { mockResolvers } from './mock-resolver.js';
import { jest } from '@jest/globals';

/**
 * Creates test environment configuration
 */
export function createTestEnvironment(): TestEnvironment {
    return {
        chainId: 'test-chain-1',
        rpcUrl: 'http://localhost:26657',
        dbUrl: 'mongodb://localhost:27017/test'
    };
}

/**
 * Creates mock database configuration
 */
export function createMockDatabase(): MockDatabase {
    const collections: { [key: string]: jest.Mocked<Collection<any>> } = {};
    
    const session = {
        startTransaction: createAsyncMock<void>(undefined),
        commitTransaction: createAsyncMock<void>(undefined),
        abortTransaction: createAsyncMock<void>(undefined),
        endSession: createAsyncMock<void>(undefined)
    } as unknown as jest.Mocked<ClientSession>;

    const client = {
        connect: createAsyncMock<void>(undefined),
        close: createAsyncMock<void>(undefined),
        db: createMockFn(() => ({
            collection: createMockFn((name: string) => {
                if (!collections[name]) {
                    collections[name] = mockResolvers.collection();
                }
                return collections[name];
            })
        })),
        startSession: createMockFn(() => session)
    } as unknown as jest.Mocked<MongoClient>;

    return {
        client,
        session,
        collections: collections as MockDatabase['collections']
    };
}

/**
 * Creates mock repositories
 */
export function createMockRepositories(): MockRepositories {
    return {
        dids: {
            findById: createAsyncMock(null),
            findOne: createAsyncMock(null),
            findMany: createAsyncMock([]),
            create: createAsyncMock('test-id'),
            update: createAsyncMock(true),
            delete: createAsyncMock(true)
        },
        wallets: {
            findById: createAsyncMock(null),
            findOne: createAsyncMock(null),
            findMany: createAsyncMock([]),
            create: createAsyncMock('test-id'),
            update: createAsyncMock(true),
            delete: createAsyncMock(true)
        }
    } as MockRepositories;
}

/**
 * Creates properly typed mock services
 */
export function createMockServices(): MockServices {
    // Create base mocks with proper typing
    const keyManager = {
        generateKeyPair: jest.fn<() => Promise<KeyPair>>(),
        sign: jest.fn<(message: Uint8Array, privateKey: Uint8Array) => Promise<Uint8Array>>(),
        verify: jest.fn<(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array) => Promise<boolean>>(),
        getPublicKeyFromPrivate: jest.fn<(privateKey: Uint8Array) => Uint8Array>(),
        publicKeyToHex: jest.fn<(publicKey: Uint8Array) => string>(),
        publicKeyFromHex: jest.fn<(hex: string) => Uint8Array>()
    };

    const walletService = {
        initialize: jest.fn<() => Promise<void>>(),
        createWallet: jest.fn<() => Promise<{ address: string }>>(),
        sign: jest.fn<(message: Uint8Array) => Promise<Uint8Array>>(),
        verify: jest.fn<(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array) => Promise<boolean>>(),
        getBalance: jest.fn<() => Promise<string>>(),
        getPublicKey: jest.fn<() => Uint8Array>()
    };

    const storageService = {
        initialize: jest.fn<() => Promise<void>>(),
        store: jest.fn<(collection: string, data: unknown) => Promise<string>>(),
        get: jest.fn<(collection: string, id: string) => Promise<unknown>>(),
        update: jest.fn<(collection: string, id: string, data: unknown) => Promise<boolean>>(),
        delete: jest.fn<(collection: string, id: string) => Promise<boolean>>()
    };

    const didService = {
        createDID: jest.fn<() => Promise<DIDDocument>>(),
        verifyDID: jest.fn<(did: DIDDocument) => Promise<boolean>>(),
        resolveDID: jest.fn<(didId: string) => Promise<DIDResolutionResult>>(),
        revokeDID: jest.fn<(didId: string) => Promise<boolean>>()
    };

    // Return typed mock services
    return {
        keyManager: jest.mocked(keyManager),
        walletService: jest.mocked(walletService),
        storageService: jest.mocked(storageService),
        didService: jest.mocked(didService)
    };
}

/**
 * Creates complete test configuration
 */
export function createTestConfig(): TestConfig {
    const env = createTestEnvironment();
    const db = createMockDatabase();
    const repositories = createMockRepositories();
    const services = createMockServices();
    
    const unitOfWork = {
        startTransaction: jest.fn<() => Promise<void>>(),
        commitTransaction: jest.fn<() => Promise<void>>(),
        rollbackTransaction: jest.fn<() => Promise<void>>(),
        getRepository: jest.fn<(name: string) => typeof repositories[keyof typeof repositories]>()
    };

    return {
        env,
        container: {} as Container,
        unitOfWork: jest.mocked(unitOfWork),
        db,
        repositories,
        services
    };
} 
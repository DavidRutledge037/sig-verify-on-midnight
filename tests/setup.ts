import { jest } from '@jest/globals';
import { Container } from '../src/core/container.js';
import { Repository } from '../src/core/repository.js';
import type { IUnitOfWork } from '../src/core/repository.js';
import type { Collection } from 'mongodb';

// 1. Define the missing types
interface TestConfig {
    container: Container;
}

interface MockServices {
    didService: jest.Mocked<any>;
    walletService: jest.Mocked<any>;
    keyManager: jest.Mocked<any>;
    storageService: jest.Mocked<any>;
}

declare global {
    var testContext: {
        config: TestConfig;
        mocks: MockServices;
        container: Container;
    } | undefined;
}

// 2. Fix the mock functions with proper types
const mockCollection = {
    findOne: jest.fn<any>(),
    find: jest.fn<any>().mockReturnValue({ toArray: jest.fn<any>() }),
    insertOne: jest.fn<any>(),
    updateOne: jest.fn<any>(),
    deleteOne: jest.fn<any>()
} as any as Collection<any>;

beforeAll(() => {
    const container = Container.getInstance();

    // Create basic mocks with explicit undefined returns for void functions
    const mocks = {
        didService: {
            createDID: jest.fn().mockResolvedValue({ id: 'test-did' }),
            verifyDID: jest.fn().mockResolvedValue(true),
            resolveDID: jest.fn().mockResolvedValue({ didDocument: { id: 'test-did' } }),
            revokeDID: jest.fn().mockResolvedValue(true)
        },
        walletService: {
            initialize: jest.fn().mockResolvedValue(undefined),
            createWallet: jest.fn().mockResolvedValue({ address: 'test-address' }),
            sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            verify: jest.fn().mockResolvedValue(true),
            getBalance: jest.fn().mockResolvedValue('1000'),
            getPublicKey: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3]))
        },
        keyManager: {
            generateKeyPair: jest.fn().mockResolvedValue({
                publicKey: new Uint8Array([1, 2, 3]),
                privateKey: new Uint8Array([4, 5, 6])
            }),
            sign: jest.fn().mockResolvedValue(new Uint8Array([7, 8, 9])),
            verify: jest.fn().mockResolvedValue(true),
            getPublicKeyFromPrivate: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
            publicKeyToHex: jest.fn().mockReturnValue('010203'),
            publicKeyFromHex: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3]))
        },
        storageService: {
            initialize: jest.fn().mockResolvedValue(undefined),
            store: jest.fn().mockResolvedValue('test-id'),
            get: jest.fn().mockResolvedValue(null),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true)
        }
    };

    // Register services with explicit undefined returns for void functions
    container.register('didService', mocks.didService);
    container.register('walletService', mocks.walletService);
    container.register('keyManager', mocks.keyManager);
    container.register('storageService', mocks.storageService);
    container.register('unitOfWork', {
        startTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        rollbackTransaction: jest.fn().mockResolvedValue(undefined),
        getRepository: jest.fn().mockReturnValue({
            findById: jest.fn().mockResolvedValue(null),
            findOne: jest.fn().mockResolvedValue(null),
            findMany: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue('test-id'),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true)
        })
    } as IUnitOfWork);

    global.testContext = { container, mocks };
});

beforeEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    if (global.testContext) {
        global.testContext.container.cleanup();
        global.testContext = undefined;
    }
});
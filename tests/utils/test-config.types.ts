import type { MongoClient, Collection, ClientSession } from 'mongodb';
import type { Container } from '../../src/core/container.js';
import type { IUnitOfWork, IRepository } from '../../src/core/repository.js';
import type { 
    IDIDService, 
    IStorageService, 
    IWalletService,
    IKeyManager 
} from '../../src/types/service.types.js';
import type { DIDDocument } from '../../src/types/did.types.js';

/**
 * Test environment configuration
 */
export interface TestEnvironment {
    chainId: string;
    rpcUrl: string;
    dbUrl: string;
}

/**
 * Mock database types
 */
export interface MockDatabase {
    client: jest.Mocked<MongoClient>;
    session: jest.Mocked<ClientSession>;
    collections: {
        dids: jest.Mocked<Collection<DIDDocument>>;
        wallets: jest.Mocked<Collection<any>>;
        [key: string]: jest.Mocked<Collection<any>>;
    };
}

/**
 * Mock repository types
 */
export interface MockRepositories {
    dids: jest.Mocked<IRepository<DIDDocument>>;
    wallets: jest.Mocked<IRepository<any>>;
    [key: string]: jest.Mocked<IRepository<any>>;
}

/**
 * Mock service types
 */
export interface MockServices {
    keyManager: jest.Mocked<IKeyManager>;
    walletService: jest.Mocked<IWalletService>;
    storageService: jest.Mocked<IStorageService>;
    didService: jest.Mocked<IDIDService>;
}

/**
 * Complete test configuration
 */
export interface TestConfig {
    env: TestEnvironment;
    container: Container;
    unitOfWork: jest.Mocked<IUnitOfWork>;
    db: MockDatabase;
    repositories: MockRepositories;
    services: MockServices;
}

/**
 * Test context for global access
 */
export interface TestContext {
    config: TestConfig;
    mocks: MockServices;
    container: Container;
}

/**
 * Service registration configuration
 */
export interface ServiceRegistration {
    name: keyof MockServices;
    implementation: any;
    dependencies?: Array<keyof MockServices>;
}

/**
 * Repository configuration
 */
export interface RepositoryConfig {
    name: string;
    collection: Collection<any>;
}

/**
 * Error types for testing
 */
export interface TestError extends Error {
    code?: string;
    details?: unknown;
}

/**
 * Test result types
 */
export interface TestResult<T> {
    success: boolean;
    data?: T;
    error?: TestError;
}

/**
 * Mock function configuration
 */
export interface MockFunctionConfig<T = any> {
    name: string;
    implementation?: (...args: any[]) => T;
    error?: Error;
}

/**
 * Test lifecycle hooks
 */
export interface TestLifecycle {
    beforeAll?: () => Promise<void>;
    beforeEach?: () => Promise<void>;
    afterEach?: () => Promise<void>;
    afterAll?: () => Promise<void>;
}

/**
 * Test suite configuration
 */
export interface TestSuiteConfig {
    name: string;
    lifecycle?: TestLifecycle;
    tests: Array<{
        name: string;
        fn: () => Promise<void>;
    }>;
} 
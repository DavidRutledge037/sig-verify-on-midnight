import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from '../../src/services/database';
import { DIDStorageService } from '../../src/services/did-storage.service';

let mongod: MongoMemoryServer;
let dbService: DatabaseService;
let storageService: DIDStorageService;

export const setupTestDatabase = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    dbService = new DatabaseService(uri, 'test-db');
    await dbService.connect();
    
    storageService = new DIDStorageService(dbService);
    await storageService.initialize();
    
    return { dbService, storageService };
};

export const teardownTestDatabase = async () => {
    if (dbService) {
        await dbService.disconnect();
    }
    if (mongod) {
        await mongod.stop();
    }
};

export const clearTestDatabase = async () => {
    if (dbService) {
        const collections = await dbService.getClient().db().collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }
};

export const getTestDatabase = () => ({ dbService, storageService });

// Add this to jest.setup.ts or in your test files
beforeAll(async () => {
    await setupTestDatabase();
});

afterAll(async () => {
    await teardownTestDatabase();
});

afterEach(async () => {
    await clearTestDatabase();
}); 
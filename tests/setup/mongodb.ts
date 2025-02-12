import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from '../../src/services/database';

let mongod: MongoMemoryServer;
let dbService: DatabaseService;

export const setupTestDatabase = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    dbService = new DatabaseService(uri, 'test-db');
    await dbService.connect();
    return dbService;
};

export const teardownTestDatabase = async () => {
    if (dbService) {
        await dbService.disconnect();
    }
    if (mongod) {
        await mongod.stop();
    }
};

export const getTestDatabase = () => dbService; 
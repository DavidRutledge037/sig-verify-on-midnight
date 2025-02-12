import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { APIService } from '../../src/services/api';
import { DIDService } from '../../src/services/did.service';
import { DatabaseService } from '../../src/services/database';

describe('E2E Workflow Tests', () => {
    let apiService: APIService;
    let didService: DIDService;
    let dbService: DatabaseService;

    beforeAll(async () => {
        dbService = new DatabaseService('mongodb://localhost:27017', 'test-db');
        await dbService.connect();
        
        didService = new DIDService();
        apiService = new APIService(didService);
    });

    afterAll(async () => {
        await dbService.disconnect();
    });

    // ... test implementations ...
}); 
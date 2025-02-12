import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import DatabaseClient from '../../src/database/client';

describe('DatabaseClient', () => {
    let client: DatabaseClient;

    beforeAll(() => {
        // Use test configuration
        const testConfig = {
            uri: 'mongodb://localhost:27017',
            dbName: 'test-db',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        };
        client = new DatabaseClient(testConfig);
    });

    afterAll(async () => {
        await client.close();
    });

    it('should be a singleton', () => {
        const client2 = DatabaseClient.getInstance();
        expect(client2).toBeDefined();
    });

    it('should throw error when accessing db before connection', () => {
        expect(() => client.getDb()).toThrow('Database not connected');
    });
}); 
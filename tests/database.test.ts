import { jest } from '@jest/globals';
import { DatabaseClient, DatabaseConfig, createMockMongoClient } from './utils/database-mock';

describe('Database Tests', () => {
    const defaultConfig: DatabaseConfig = {
        uri: 'mongodb://localhost:27017',
        dbName: 'testdb',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    };

    let client: DatabaseClient;

    beforeEach(() => {
        client = new DatabaseClient(defaultConfig);
    });

    afterEach(async () => {
        await client.close();
    });

    it('should handle connection errors', async () => {
        const mockClient = createMockMongoClient();
        const error = new Error('Connection failed');
        mockClient.connect = jest.fn().mockRejectedValue(error);
        
        const dbClient = new DatabaseClient(defaultConfig);
        await expect(dbClient.connect()).rejects.toThrow('Connection failed');
    });

    // ... rest of your tests ...
});

import { jest } from '@jest/globals';
import type { Collection, MongoClient } from 'mongodb';
import type { IUnitOfWork } from '../../src/core/repository.js';
import { DatabaseClient } from '../../src/database/client.js';

describe('DatabaseClient', () => {
    let databaseClient: DatabaseClient;
    let mockMongoClient: jest.Mocked<MongoClient>;
    let unitOfWork: jest.Mocked<IUnitOfWork>;
    
    beforeEach(() => {
        // Get dependencies from container
        const { container } = global.testContext;
        unitOfWork = container.resolve('unitOfWork');
        
        // Setup mock MongoDB client
        mockMongoClient = {
            connect: jest.fn().mockResolvedValue(undefined),
            close: jest.fn().mockResolvedValue(undefined),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
                    findOne: jest.fn().mockResolvedValue(null),
                    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
                    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
                })
            })
        } as unknown as jest.Mocked<MongoClient>;
        
        // Initialize database client with mocked MongoDB client
        databaseClient = new DatabaseClient('mongodb://localhost:27017/test');
        (databaseClient as any).client = mockMongoClient;
    });

    describe('getInstance', () => {
        it('should create a singleton instance', async () => {
            // Act
            const instance1 = await DatabaseClient.getInstance('mongodb://localhost:27017/test');
            const instance2 = await DatabaseClient.getInstance('mongodb://localhost:27017/test');

            // Assert
            expect(instance1).toBe(instance2);
        });

        it('should throw on invalid connection string', async () => {
            // Act & Assert
            await expect(DatabaseClient.getInstance('invalid-uri'))
                .rejects
                .toThrow('Invalid connection string');
        });
    });

    describe('connect', () => {
        it('should connect successfully', async () => {
            // Act
            await databaseClient.connect();

            // Assert
            expect(mockMongoClient.connect).toHaveBeenCalled();
            expect(databaseClient.isInitialized()).toBe(true);
        });

        it('should handle connection errors', async () => {
            // Arrange
            mockMongoClient.connect.mockRejectedValueOnce(new Error('Connection failed'));

            // Act & Assert
            await expect(databaseClient.connect())
                .rejects
                .toThrow('Connection failed');
        });

        it('should not connect if already connected', async () => {
            // Arrange
            await databaseClient.connect();
            
            // Act
            await databaseClient.connect();

            // Assert
            expect(mockMongoClient.connect).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCollection', () => {
        beforeEach(async () => {
            await databaseClient.connect();
        });

        it('should return a collection', () => {
            // Act
            const collection = databaseClient.getCollection('test');

            // Assert
            expect(collection).toBeDefined();
            expect(mockMongoClient.db).toHaveBeenCalled();
        });

        it('should throw if not connected', async () => {
            // Arrange
            await databaseClient.close();

            // Act & Assert
            expect(() => databaseClient.getCollection('test'))
                .toThrow('Database not connected');
        });

        it('should cache collections', () => {
            // Act
            const collection1 = databaseClient.getCollection('test');
            const collection2 = databaseClient.getCollection('test');

            // Assert
            expect(collection1).toBe(collection2);
            expect(mockMongoClient.db).toHaveBeenCalledTimes(1);
        });
    });

    describe('close', () => {
        beforeEach(async () => {
            await databaseClient.connect();
        });

        it('should close connection', async () => {
            // Act
            await databaseClient.close();

            // Assert
            expect(mockMongoClient.close).toHaveBeenCalled();
            expect(databaseClient.isInitialized()).toBe(false);
        });

        it('should handle close errors', async () => {
            // Arrange
            mockMongoClient.close.mockRejectedValueOnce(new Error('Close failed'));

            // Act & Assert
            await expect(databaseClient.close())
                .rejects
                .toThrow('Close failed');
        });

        it('should do nothing if already closed', async () => {
            // Arrange
            await databaseClient.close();
            
            // Act
            await databaseClient.close();

            // Assert
            expect(mockMongoClient.close).toHaveBeenCalledTimes(1);
        });
    });
}); 
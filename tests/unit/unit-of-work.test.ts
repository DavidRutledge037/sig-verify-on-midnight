import { jest } from '@jest/globals';
import type { MongoClient, Collection, ClientSession } from 'mongodb';
import { UnitOfWork, IUnitOfWork } from '../../src/core/repository.js';
import type { DIDDocument } from '../../src/types/did.types.js';

describe('UnitOfWork', () => {
    let unitOfWork: IUnitOfWork;
    let mockMongoClient: jest.Mocked<MongoClient>;
    let mockSession: jest.Mocked<ClientSession>;
    let mockCollection: jest.Mocked<Collection<any>>;
    
    beforeEach(() => {
        // Setup mock session
        mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn().mockResolvedValue(undefined),
            abortTransaction: jest.fn().mockResolvedValue(undefined),
            endSession: jest.fn().mockResolvedValue(undefined)
        } as unknown as jest.Mocked<ClientSession>;

        // Setup mock collection
        mockCollection = {
            insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
            findOne: jest.fn().mockResolvedValue(null),
            updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
            deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
        } as unknown as jest.Mocked<Collection>;

        // Setup mock MongoDB client
        mockMongoClient = {
            startSession: jest.fn().mockReturnValue(mockSession),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue(mockCollection)
            })
        } as unknown as jest.Mocked<MongoClient>;

        // Create UnitOfWork instance
        unitOfWork = new UnitOfWork(mockMongoClient);
    });

    describe('Transaction Management', () => {
        it('should start transaction', async () => {
            // Act
            await unitOfWork.startTransaction();

            // Assert
            expect(mockMongoClient.startSession).toHaveBeenCalled();
            expect(mockSession.startTransaction).toHaveBeenCalled();
        });

        it('should commit transaction', async () => {
            // Arrange
            await unitOfWork.startTransaction();

            // Act
            await unitOfWork.commitTransaction();

            // Assert
            expect(mockSession.commitTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it('should rollback transaction', async () => {
            // Arrange
            await unitOfWork.startTransaction();

            // Act
            await unitOfWork.rollbackTransaction();

            // Assert
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it('should handle transaction errors', async () => {
            // Arrange
            mockSession.startTransaction.mockImplementation(() => {
                throw new Error('Transaction failed');
            });

            // Act & Assert
            await expect(unitOfWork.startTransaction())
                .rejects
                .toThrow('Transaction failed');
        });
    });

    describe('Repository Management', () => {
        it('should create repository', () => {
            // Act
            const repository = unitOfWork.getRepository<DIDDocument>('dids');

            // Assert
            expect(repository).toBeDefined();
            expect(mockMongoClient.db).toHaveBeenCalled();
        });

        it('should reuse existing repository', () => {
            // Act
            const repository1 = unitOfWork.getRepository<DIDDocument>('dids');
            const repository2 = unitOfWork.getRepository<DIDDocument>('dids');

            // Assert
            expect(repository1).toBe(repository2);
            expect(mockMongoClient.db).toHaveBeenCalledTimes(1);
        });

        it('should create different repositories for different collections', () => {
            // Act
            const didsRepo = unitOfWork.getRepository<DIDDocument>('dids');
            const keysRepo = unitOfWork.getRepository<any>('keys');

            // Assert
            expect(didsRepo).not.toBe(keysRepo);
        });
    });

    describe('Transaction Integration', () => {
        it('should use transaction in repository operations', async () => {
            // Arrange
            await unitOfWork.startTransaction();
            const repository = unitOfWork.getRepository<DIDDocument>('dids');

            // Act
            await repository.create({ id: 'test' } as DIDDocument);
            await unitOfWork.commitTransaction();

            // Assert
            expect(mockCollection.insertOne).toHaveBeenCalledWith(
                { id: 'test' },
                { session: mockSession }
            );
        });

        it('should rollback on error', async () => {
            // Arrange
            await unitOfWork.startTransaction();
            const repository = unitOfWork.getRepository<DIDDocument>('dids');
            mockCollection.insertOne.mockRejectedValue(new Error('Insert failed'));

            // Act
            try {
                await repository.create({ id: 'test' } as DIDDocument);
            } catch {
                await unitOfWork.rollbackTransaction();
            }

            // Assert
            expect(mockSession.abortTransaction).toHaveBeenCalled();
        });
    });
}); 
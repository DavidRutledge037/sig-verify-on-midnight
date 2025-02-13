import { jest } from '@jest/globals';
import type { Collection } from 'mongodb';
import { Repository, IRepository } from '../../src/core/repository.js';
import type { DIDDocument } from '../../src/types/did.types.js';

describe('Repository', () => {
    let repository: IRepository<DIDDocument>;
    let mockCollection: jest.Mocked<Collection<DIDDocument>>;
    
    beforeEach(() => {
        // Create mock collection
        mockCollection = {
            findOne: jest.fn(),
            find: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn()
        } as unknown as jest.Mocked<Collection<DIDDocument>>;

        // Setup mock find().toArray()
        mockCollection.find.mockReturnValue({
            toArray: jest.fn().mockResolvedValue([])
        } as any);

        // Create repository instance
        repository = new Repository<DIDDocument>(mockCollection);
    });

    describe('findById', () => {
        it('should find document by id', async () => {
            // Arrange
            const mockDoc = { id: 'test-id', controller: 'test' } as DIDDocument;
            mockCollection.findOne.mockResolvedValue(mockDoc);

            // Act
            const result = await repository.findById('test-id');

            // Assert
            expect(result).toEqual(mockDoc);
            expect(mockCollection.findOne).toHaveBeenCalledWith(
                { _id: 'test-id' }
            );
        });

        it('should return null for non-existent document', async () => {
            // Arrange
            mockCollection.findOne.mockResolvedValue(null);

            // Act
            const result = await repository.findById('nonexistent');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('findOne', () => {
        it('should find document by filter', async () => {
            // Arrange
            const mockDoc = { id: 'test-id', controller: 'test' } as DIDDocument;
            mockCollection.findOne.mockResolvedValue(mockDoc);

            // Act
            const result = await repository.findOne({ controller: 'test' });

            // Assert
            expect(result).toEqual(mockDoc);
            expect(mockCollection.findOne).toHaveBeenCalledWith(
                { controller: 'test' }
            );
        });
    });

    describe('findMany', () => {
        it('should find multiple documents', async () => {
            // Arrange
            const mockDocs = [
                { id: 'test-1', controller: 'test' },
                { id: 'test-2', controller: 'test' }
            ] as DIDDocument[];
            
            mockCollection.find.mockReturnValue({
                toArray: jest.fn().mockResolvedValue(mockDocs)
            } as any);

            // Act
            const results = await repository.findMany({ controller: 'test' });

            // Assert
            expect(results).toEqual(mockDocs);
            expect(mockCollection.find).toHaveBeenCalledWith(
                { controller: 'test' }
            );
        });
    });

    describe('create', () => {
        it('should create new document', async () => {
            // Arrange
            const newDoc = { id: 'test-id', controller: 'test' } as DIDDocument;
            mockCollection.insertOne.mockResolvedValue({ 
                insertedId: 'test-id',
                acknowledged: true 
            });

            // Act
            const id = await repository.create(newDoc);

            // Assert
            expect(id).toBe('test-id');
            expect(mockCollection.insertOne).toHaveBeenCalledWith(newDoc);
        });

        it('should handle creation errors', async () => {
            // Arrange
            mockCollection.insertOne.mockRejectedValue(new Error('Insert failed'));

            // Act & Assert
            await expect(repository.create({} as DIDDocument))
                .rejects
                .toThrow('Insert failed');
        });
    });

    describe('update', () => {
        it('should update existing document', async () => {
            // Arrange
            const updateData = { controller: 'new-test' };
            mockCollection.updateOne.mockResolvedValue({ 
                modifiedCount: 1,
                matchedCount: 1,
                acknowledged: true,
                upsertedCount: 0,
                upsertedId: null
            });

            // Act
            const result = await repository.update('test-id', updateData);

            // Assert
            expect(result).toBe(true);
            expect(mockCollection.updateOne).toHaveBeenCalledWith(
                { _id: 'test-id' },
                { $set: updateData }
            );
        });

        it('should return false if document not found', async () => {
            // Arrange
            mockCollection.updateOne.mockResolvedValue({ 
                modifiedCount: 0,
                matchedCount: 0,
                acknowledged: true,
                upsertedCount: 0,
                upsertedId: null
            });

            // Act
            const result = await repository.update('nonexistent', {});

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('delete', () => {
        it('should delete existing document', async () => {
            // Arrange
            mockCollection.deleteOne.mockResolvedValue({ 
                deletedCount: 1,
                acknowledged: true
            });

            // Act
            const result = await repository.delete('test-id');

            // Assert
            expect(result).toBe(true);
            expect(mockCollection.deleteOne).toHaveBeenCalledWith(
                { _id: 'test-id' }
            );
        });

        it('should return false if document not found', async () => {
            // Arrange
            mockCollection.deleteOne.mockResolvedValue({ 
                deletedCount: 0,
                acknowledged: true
            });

            // Act
            const result = await repository.delete('nonexistent');

            // Assert
            expect(result).toBe(false);
        });
    });
}); 
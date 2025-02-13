import { jest } from '@jest/globals';
import type { IStorageService } from '../../src/types/service.types.js';
import type { IUnitOfWork, IRepository } from '../../src/core/repository.js';
import type { DIDDocument } from '../../src/types/did.types.js';

describe('DIDStorageService', () => {
    let storageService: IStorageService;
    let unitOfWork: jest.Mocked<IUnitOfWork>;
    let mockRepository: jest.Mocked<IRepository<DIDDocument>>;
    
    beforeEach(() => {
        // Get services from container
        const { container, mocks } = global.testContext;
        storageService = container.resolve('storageService');
        unitOfWork = container.resolve('unitOfWork');
        
        // Setup mock repository
        mockRepository = {
            findById: jest.fn(),
            findOne: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as jest.Mocked<IRepository<DIDDocument>>;
        
        // Configure UnitOfWork to return our mock repository
        unitOfWork.getRepository.mockReturnValue(mockRepository);
    });

    describe('initialize', () => {
        it('should initialize storage service', async () => {
            // Act
            await storageService.initialize();

            // Assert
            expect(storageService.initialize).toHaveBeenCalled();
        });

        it('should handle initialization errors', async () => {
            // Arrange
            jest.spyOn(storageService, 'initialize')
                .mockRejectedValueOnce(new Error('Init failed'));

            // Act & Assert
            await expect(storageService.initialize())
                .rejects
                .toThrow('Init failed');
        });
    });

    describe('store', () => {
        const testDID: DIDDocument = {
            id: 'did:midnight:test',
            controller: 'did:midnight:test',
            verificationMethod: [],
            authentication: [],
            assertionMethod: [],
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        beforeEach(async () => {
            await storageService.initialize();
        });

        it('should store DID document', async () => {
            // Arrange
            mockRepository.create.mockResolvedValue('test-id');

            // Act
            const id = await storageService.store('dids', testDID);

            // Assert
            expect(id).toBe('test-id');
            expect(unitOfWork.startTransaction).toHaveBeenCalled();
            expect(unitOfWork.commitTransaction).toHaveBeenCalled();
        });

        it('should rollback on storage error', async () => {
            // Arrange
            mockRepository.create.mockRejectedValue(new Error('Storage failed'));

            // Act & Assert
            await expect(storageService.store('dids', testDID))
                .rejects
                .toThrow('Storage failed');
            expect(unitOfWork.rollbackTransaction).toHaveBeenCalled();
        });

        it('should validate DID before storage', async () => {
            // Arrange
            const invalidDID = { ...testDID, id: '' };

            // Act & Assert
            await expect(storageService.store('dids', invalidDID))
                .rejects
                .toThrow('Invalid DID document');
        });
    });

    describe('get', () => {
        it('should retrieve DID document', async () => {
            // Arrange
            const mockDID = {
                id: 'did:midnight:test',
                controller: 'did:midnight:test'
            } as DIDDocument;
            mockRepository.findById.mockResolvedValue(mockDID);

            // Act
            const result = await storageService.get('dids', 'test-id');

            // Assert
            expect(result).toEqual(mockDID);
        });

        it('should return null for non-existent DID', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act
            const result = await storageService.get('dids', 'nonexistent');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update DID document', async () => {
            // Arrange
            mockRepository.update.mockResolvedValue(true);
            const updateData = { updated: new Date().toISOString() };

            // Act
            const result = await storageService.update('dids', 'test-id', updateData);

            // Assert
            expect(result).toBe(true);
            expect(unitOfWork.startTransaction).toHaveBeenCalled();
            expect(unitOfWork.commitTransaction).toHaveBeenCalled();
        });

        it('should handle update failures', async () => {
            // Arrange
            mockRepository.update.mockResolvedValue(false);

            // Act
            const result = await storageService.update('dids', 'nonexistent', {});

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('delete', () => {
        it('should delete DID document', async () => {
            // Arrange
            mockRepository.delete.mockResolvedValue(true);

            // Act
            const result = await storageService.delete('dids', 'test-id');

            // Assert
            expect(result).toBe(true);
            expect(unitOfWork.startTransaction).toHaveBeenCalled();
            expect(unitOfWork.commitTransaction).toHaveBeenCalled();
        });

        it('should handle deletion failures', async () => {
            // Arrange
            mockRepository.delete.mockResolvedValue(false);

            // Act
            const result = await storageService.delete('dids', 'nonexistent');

            // Assert
            expect(result).toBe(false);
        });
    });
}); 
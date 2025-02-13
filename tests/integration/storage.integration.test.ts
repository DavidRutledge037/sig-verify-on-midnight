import { jest } from '@jest/globals';
import type { IStorageService } from '../../src/types/service.types.js';
import type { IUnitOfWork } from '../../src/core/repository.js';
import type { DIDDocument } from '../../src/types/did.types.js';
import { createMockDIDDocument } from '../utils/test-helpers.js';
import { delay } from '../utils/test-helpers.js';

describe('Storage Integration', () => {
    let storageService: IStorageService;
    let unitOfWork: IUnitOfWork;
    
    beforeAll(async () => {
        const { container } = global.testContext!;
        storageService = container.resolve('storageService');
        unitOfWork = container.resolve('unitOfWork');
        
        await storageService.initialize();
    });

    describe('Transaction Management', () => {
        it('should handle successful transactions', async () => {
            // Arrange
            const doc = createMockDIDDocument();
            await unitOfWork.startTransaction();

            try {
                // Act
                const id = await storageService.store('dids', doc);
                const stored = await storageService.get('dids', id);
                await unitOfWork.commitTransaction();

                // Assert
                expect(stored).toBeDefined();
                expect(stored?.id).toBe(doc.id);
            } catch (error) {
                await unitOfWork.rollbackTransaction();
                throw error;
            }
        });

        it('should rollback failed transactions', async () => {
            // Arrange
            const doc = createMockDIDDocument();
            await unitOfWork.startTransaction();

            try {
                // Act
                const id = await storageService.store('dids', doc);
                throw new Error('Simulated failure');
            } catch (error) {
                // Assert
                await unitOfWork.rollbackTransaction();
                const stored = await storageService.get('dids', doc.id);
                expect(stored).toBeNull();
            }
        });
    });

    describe('Concurrent Operations', () => {
        it('should handle concurrent writes', async () => {
            // Arrange
            const docs = Array(5).fill(null).map(() => createMockDIDDocument());
            
            // Act
            const results = await Promise.all(
                docs.map(doc => storageService.store('dids', doc))
            );

            // Assert
            expect(results).toHaveLength(5);
            expect(new Set(results).size).toBe(5); // All IDs should be unique
        });

        it('should handle concurrent reads', async () => {
            // Arrange
            const doc = createMockDIDDocument();
            const id = await storageService.store('dids', doc);

            // Act
            const results = await Promise.all(
                Array(5).fill(null).map(() => storageService.get('dids', id))
            );

            // Assert
            results.forEach(result => {
                expect(result).toBeDefined();
                expect(result?.id).toBe(doc.id);
            });
        });
    });

    describe('Data Consistency', () => {
        it('should maintain data integrity', async () => {
            // Arrange
            const original = createMockDIDDocument();
            
            // Act
            const id = await storageService.store('dids', original);
            const stored = await storageService.get('dids', id);

            // Assert
            expect(stored).toEqual(original);
        });

        it('should handle updates atomically', async () => {
            // Arrange
            const doc = createMockDIDDocument();
            const id = await storageService.store('dids', doc);

            // Act
            const update = { ...doc, updated: new Date().toISOString() };
            await storageService.update('dids', id, update);
            const result = await storageService.get('dids', id);

            // Assert
            expect(result?.updated).toBe(update.updated);
        });
    });

    describe('Error Recovery', () => {
        it('should handle connection interruptions', async () => {
            // Arrange
            const doc = createMockDIDDocument();
            jest.spyOn(storageService, 'store')
                .mockRejectedValueOnce(new Error('Connection lost'));

            // Act & Assert
            await expect(storageService.store('dids', doc))
                .rejects
                .toThrow('Connection lost');
            
            // Retry after delay
            await delay(100);
            const id = await storageService.store('dids', doc);
            expect(id).toBeDefined();
        });

        it('should handle partial failures', async () => {
            // Arrange
            const docs = Array(5).fill(null).map(() => createMockDIDDocument());
            const failIndex = 2;
            
            jest.spyOn(storageService, 'store')
                .mockImplementationOnce(async (collection, doc) => {
                    if (docs.indexOf(doc as DIDDocument) === failIndex) {
                        throw new Error('Partial failure');
                    }
                    return 'test-id';
                });

            // Act
            const results = await Promise.allSettled(
                docs.map(doc => storageService.store('dids', doc))
            );

            // Assert
            expect(results[failIndex].status).toBe('rejected');
            results.forEach((result, index) => {
                if (index !== failIndex) {
                    expect(result.status).toBe('fulfilled');
                }
            });
        });
    });

    describe('Collection Management', () => {
        it('should handle multiple collections', async () => {
            // Arrange
            const didDoc = createMockDIDDocument();
            const walletDoc = { address: 'test', balance: '1000' };

            // Act
            const didId = await storageService.store('dids', didDoc);
            const walletId = await storageService.store('wallets', walletDoc);

            // Assert
            const storedDid = await storageService.get('dids', didId);
            const storedWallet = await storageService.get('wallets', walletId);
            expect(storedDid).toBeDefined();
            expect(storedWallet).toBeDefined();
        });

        it('should isolate collection data', async () => {
            // Arrange
            const doc = createMockDIDDocument();
            const id = await storageService.store('dids', doc);

            // Act
            const fromDids = await storageService.get('dids', id);
            const fromWallets = await storageService.get('wallets', id);

            // Assert
            expect(fromDids).toBeDefined();
            expect(fromWallets).toBeNull();
        });
    });
}); 
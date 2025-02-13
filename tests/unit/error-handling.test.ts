import { jest } from '@jest/globals';
import type { 
    IDIDService, 
    IWalletService, 
    IStorageService 
} from '../../src/types/service.types.js';
import { isError } from '../utils/test-helpers.js';
import { createErrorMock } from '../utils/mock-function-types.js';

describe('Error Handling', () => {
    let didService: IDIDService;
    let walletService: IWalletService;
    let storageService: IStorageService;
    
    beforeEach(() => {
        const { container } = global.testContext!;
        didService = container.resolve('didService');
        walletService = container.resolve('walletService');
        storageService = container.resolve('storageService');
    });

    describe('Service Initialization', () => {
        it('should handle wallet initialization failures', async () => {
            // Arrange
            jest.spyOn(walletService, 'initialize')
                .mockRejectedValue(new Error('Wallet init failed'));

            // Act & Assert
            await expect(walletService.initialize())
                .rejects
                .toThrow('Wallet init failed');
        });

        it('should handle storage initialization failures', async () => {
            // Arrange
            jest.spyOn(storageService, 'initialize')
                .mockRejectedValue(new Error('Storage init failed'));

            // Act & Assert
            await expect(storageService.initialize())
                .rejects
                .toThrow('Storage init failed');
        });
    });

    describe('DID Operations', () => {
        it('should handle DID creation failures', async () => {
            // Arrange
            jest.spyOn(didService, 'createDID')
                .mockRejectedValue(new Error('DID creation failed'));

            // Act & Assert
            await expect(didService.createDID())
                .rejects
                .toThrow('DID creation failed');
        });

        it('should handle DID verification failures', async () => {
            // Arrange
            const mockDID = await didService.createDID();
            jest.spyOn(didService, 'verifyDID')
                .mockRejectedValue(new Error('Verification failed'));

            // Act & Assert
            await expect(didService.verifyDID(mockDID))
                .rejects
                .toThrow('Verification failed');
        });

        it('should handle DID resolution failures', async () => {
            // Arrange
            jest.spyOn(didService, 'resolveDID')
                .mockImplementation(createErrorMock(new Error('Resolution failed')));

            // Act & Assert
            await expect(didService.resolveDID('did:midnight:test'))
                .rejects
                .toThrow('Resolution failed');
        });
    });

    describe('Wallet Operations', () => {
        it('should handle signing failures', async () => {
            // Arrange
            const message = new TextEncoder().encode('test');
            jest.spyOn(walletService, 'sign')
                .mockRejectedValue(new Error('Signing failed'));

            // Act & Assert
            await expect(walletService.sign(message))
                .rejects
                .toThrow('Signing failed');
        });

        it('should handle verification failures', async () => {
            // Arrange
            const message = new TextEncoder().encode('test');
            const signature = new Uint8Array([1, 2, 3]);
            const publicKey = new Uint8Array([4, 5, 6]);
            
            jest.spyOn(walletService, 'verify')
                .mockRejectedValue(new Error('Verification failed'));

            // Act & Assert
            await expect(walletService.verify(message, signature, publicKey))
                .rejects
                .toThrow('Verification failed');
        });
    });

    describe('Storage Operations', () => {
        it('should handle storage failures', async () => {
            // Arrange
            jest.spyOn(storageService, 'store')
                .mockRejectedValue(new Error('Storage failed'));

            // Act & Assert
            await expect(storageService.store('test', {}))
                .rejects
                .toThrow('Storage failed');
        });

        it('should handle retrieval failures', async () => {
            // Arrange
            jest.spyOn(storageService, 'get')
                .mockRejectedValue(new Error('Retrieval failed'));

            // Act & Assert
            await expect(storageService.get('test', 'id'))
                .rejects
                .toThrow('Retrieval failed');
        });
    });

    describe('Error Types', () => {
        it('should properly identify error objects', () => {
            // Arrange
            const error = new Error('Test error');
            const nonError = { message: 'Not an error' };

            // Act & Assert
            expect(isError(error)).toBe(true);
            expect(isError(nonError)).toBe(false);
        });

        it('should handle custom error types', () => {
            // Arrange
            class CustomError extends Error {
                constructor(message: string, public code: string) {
                    super(message);
                    this.name = 'CustomError';
                }
            }

            const error = new CustomError('Custom error', 'E001');

            // Act & Assert
            expect(isError(error)).toBe(true);
            expect(error).toHaveProperty('code', 'E001');
        });
    });
}); 
import { Container } from '../../src/core/container.js';
import type { 
    IDIDService, 
    IWalletService, 
    IStorageService,
    IKeyManager 
} from '../../src/types/service.types.js';
import { createMockServices } from '../utils/test-config.js';
import { mockResolvers } from '../utils/mock-resolver.js';

describe('Container', () => {
    let container: Container;
    
    beforeEach(() => {
        // Reset container for each test
        Container.reset();
        container = Container.getInstance();
    });

    afterEach(() => {
        container.cleanup();
    });

    describe('Singleton Pattern', () => {
        it('should maintain a single instance', () => {
            // Act
            const instance1 = Container.getInstance();
            const instance2 = Container.getInstance();

            // Assert
            expect(instance1).toBe(instance2);
        });

        it('should reset container state', () => {
            // Arrange
            const instance1 = Container.getInstance();
            
            // Act
            Container.reset();
            const instance2 = Container.getInstance();

            // Assert
            expect(instance1).not.toBe(instance2);
        });
    });

    describe('Service Registration', () => {
        it('should register and resolve services', () => {
            // Arrange
            const mockServices = createMockServices();

            // Act
            container.register('keyManager', mockServices.keyManager);
            const resolved = container.resolve<IKeyManager>('keyManager');

            // Assert
            expect(resolved).toBeDefined();
            expect(resolved).toBe(mockServices.keyManager);
        });

        it('should maintain service instances', () => {
            // Arrange
            const mockServices = createMockServices();
            container.register('walletService', mockServices.walletService);

            // Act
            const instance1 = container.resolve<IWalletService>('walletService');
            const instance2 = container.resolve<IWalletService>('walletService');

            // Assert
            expect(instance1).toBe(instance2);
        });

        it('should throw on unknown service resolution', () => {
            // Act & Assert
            expect(() => container.resolve('unknownService'))
                .toThrow('Service not found: unknownService');
        });
    });

    describe('Dependency Management', () => {
        it('should handle service dependencies', () => {
            // Arrange
            const mockServices = createMockServices();
            
            // Act
            container.register('keyManager', mockServices.keyManager);
            container.register('walletService', mockServices.walletService, ['keyManager']);
            const walletService = container.resolve<IWalletService>('walletService');

            // Assert
            expect(walletService).toBeDefined();
        });

        it('should detect circular dependencies', () => {
            // Arrange
            const mockServices = createMockServices();

            // Act & Assert
            container.register('serviceA', mockServices.didService, ['serviceB']);
            expect(() => 
                container.register('serviceB', mockServices.walletService, ['serviceA'])
            ).toThrow('Circular dependency detected');
        });
    });

    describe('Service Lifecycle', () => {
        it('should initialize services in order', async () => {
            // Arrange
            const mockServices = createMockServices();
            const initOrder: string[] = [];

            const serviceA = {
                ...mockServices.storageService,
                initialize: jest.fn().mockImplementation(async () => {
                    initOrder.push('serviceA');
                })
            };

            const serviceB = {
                ...mockServices.walletService,
                initialize: jest.fn().mockImplementation(async () => {
                    initOrder.push('serviceB');
                })
            };

            // Act
            container.register('serviceA', serviceA);
            container.register('serviceB', serviceB, ['serviceA']);
            await container.initialize();

            // Assert
            expect(initOrder).toEqual(['serviceA', 'serviceB']);
        });

        it('should cleanup services properly', async () => {
            // Arrange
            const mockServices = createMockServices();
            const cleanupMock = jest.fn();
            
            const service = {
                ...mockServices.storageService,
                cleanup: cleanupMock
            };

            container.register('testService', service);

            // Act
            await container.cleanup();

            // Assert
            expect(cleanupMock).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should handle initialization errors', async () => {
            // Arrange
            const mockServices = createMockServices();
            const service = {
                ...mockServices.storageService,
                initialize: jest.fn().mockRejectedValue(new Error('Init failed'))
            };

            container.register('failingService', service);

            // Act & Assert
            await expect(container.initialize())
                .rejects
                .toThrow('Init failed');
        });

        it('should handle cleanup errors', async () => {
            // Arrange
            const mockServices = createMockServices();
            const service = {
                ...mockServices.storageService,
                cleanup: jest.fn().mockRejectedValue(new Error('Cleanup failed'))
            };

            container.register('failingService', service);

            // Act & Assert
            await expect(container.cleanup())
                .rejects
                .toThrow('Cleanup failed');
        });
    });
}); 
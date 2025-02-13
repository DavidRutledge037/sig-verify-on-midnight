import { jest } from '@jest/globals';
import type { 
    IDIDService, 
    IWalletService, 
    IStorageService 
} from '../../src/types/service.types.js';
import type { DIDDocument } from '../../src/types/did.types.js';
import { delay } from '../utils/test-helpers.js';

describe('DID End-to-End', () => {
    let didService: IDIDService;
    let walletService: IWalletService;
    let storageService: IStorageService;
    
    beforeAll(async () => {
        const { container } = global.testContext!;
        didService = container.resolve('didService');
        walletService = container.resolve('walletService');
        storageService = container.resolve('storageService');
        
        // Initialize all required services
        await Promise.all([
            walletService.initialize(),
            storageService.initialize()
        ]);
    });

    describe('DID Lifecycle', () => {
        let testDID: DIDDocument;
        let wallet: { address: string };

        beforeEach(async () => {
            wallet = await walletService.createWallet();
        });

        it('should create and store a new DID', async () => {
            // Act
            testDID = await didService.createDID();

            // Assert
            expect(testDID.id).toMatch(/^did:midnight:/);
            expect(testDID.controller).toBe(testDID.id);
            expect(testDID.verificationMethod).toHaveLength(1);
            
            // Verify storage
            const stored = await storageService.get('dids', testDID.id);
            expect(stored).toMatchObject(testDID);
        });

        it('should resolve and verify the DID', async () => {
            // Act
            const resolution = await didService.resolveDID(testDID.id);
            const isValid = await didService.verifyDID(resolution.didDocument);

            // Assert
            expect(resolution.didDocument).toMatchObject(testDID);
            expect(isValid).toBe(true);
            expect(resolution.didResolutionMetadata.contentType)
                .toBe('application/did+json');
        });

        it('should update DID document', async () => {
            // Arrange
            const newService = {
                id: `${testDID.id}#messaging`,
                type: 'DIDCommMessaging',
                serviceEndpoint: 'https://example.com/endpoint'
            };

            // Act
            testDID.service = [newService];
            const updated = await storageService.update('dids', testDID.id, testDID);
            const resolved = await didService.resolveDID(testDID.id);

            // Assert
            expect(updated).toBe(true);
            expect(resolved.didDocument.service).toContainEqual(newService);
        });

        it('should revoke DID', async () => {
            // Act
            const revoked = await didService.revokeDID(testDID.id);
            
            // Assert
            expect(revoked).toBe(true);
            
            // Verify DID is no longer resolvable
            await expect(didService.resolveDID(testDID.id))
                .rejects
                .toThrow('DID not found');
        });
    });

    describe('DID Operations', () => {
        it('should handle concurrent DID creation', async () => {
            // Act
            const dids = await Promise.all(
                Array(3).fill(null).map(() => didService.createDID())
            );

            // Assert
            const ids = dids.map(did => did.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(3);

            // Verify all DIDs are stored
            await Promise.all(dids.map(async did => {
                const stored = await storageService.get('dids', did.id);
                expect(stored).toBeDefined();
            }));
        });

        it('should handle concurrent DID resolution', async () => {
            // Arrange
            const did = await didService.createDID();

            // Act
            const resolutions = await Promise.all(
                Array(3).fill(null).map(() => didService.resolveDID(did.id))
            );

            // Assert
            resolutions.forEach(resolution => {
                expect(resolution.didDocument.id).toBe(did.id);
            });
        });
    });

    describe('Error Scenarios', () => {
        it('should handle non-existent DID', async () => {
            // Act & Assert
            await expect(didService.resolveDID('did:midnight:nonexistent'))
                .rejects
                .toThrow('DID not found');
        });

        it('should handle invalid DID format', async () => {
            // Act & Assert
            await expect(didService.resolveDID('invalid:did:format'))
                .rejects
                .toThrow('Invalid DID format');
        });

        it('should handle service failures', async () => {
            // Arrange
            jest.spyOn(storageService, 'get')
                .mockRejectedValueOnce(new Error('Service unavailable'));

            // Act & Assert
            await expect(didService.resolveDID('did:midnight:test'))
                .rejects
                .toThrow('Service unavailable');
        });

        it('should handle network latency', async () => {
            // Arrange
            const did = await didService.createDID();
            jest.spyOn(storageService, 'get')
                .mockImplementationOnce(async () => {
                    await delay(1000);
                    return null;
                });

            // Act & Assert
            await expect(didService.resolveDID(did.id))
                .rejects
                .toThrow('DID not found');
        });
    });

    describe('System Recovery', () => {
        it('should recover from temporary failures', async () => {
            // Arrange
            const did = await didService.createDID();
            let callCount = 0;
            
            jest.spyOn(storageService, 'get')
                .mockImplementation(async () => {
                    callCount++;
                    if (callCount === 1) {
                        throw new Error('Temporary failure');
                    }
                    return did;
                });

            // Act
            try {
                await didService.resolveDID(did.id);
            } catch {
                await delay(100);
                const resolution = await didService.resolveDID(did.id);
                
                // Assert
                expect(resolution.didDocument).toMatchObject(did);
            }
        });
    });
}); 
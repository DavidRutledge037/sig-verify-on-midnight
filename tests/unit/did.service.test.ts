import { jest } from '@jest/globals';
import type { DIDDocument } from '../../src/types/did.types.js';
import type { IDIDService, IWalletService } from '../../src/types/service.types.js';

describe('DIDService', () => {
    let didService: IDIDService;
    let walletService: jest.Mocked<IWalletService>;

    beforeEach(() => {
        // Get services from container
        const { container, mocks } = global.testContext;
        didService = container.resolve('didService');
        walletService = mocks.walletService;
    });

    describe('createDID', () => {
        it('should create a new DID document', async () => {
            // Arrange
            const expectedDID: DIDDocument = {
                id: 'did:midnight:test',
                controller: 'did:midnight:test',
                verificationMethod: [{
                    id: 'did:midnight:test#key-1',
                    type: 'Ed25519VerificationKey2020',
                    controller: 'did:midnight:test',
                    publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
                }],
                authentication: ['did:midnight:test#key-1'],
                assertionMethod: ['did:midnight:test#key-1'],
                created: expect.any(String),
                updated: expect.any(String)
            };

            // Act
            const result = await didService.createDID();

            // Assert
            expect(result).toMatchObject(expectedDID);
            expect(walletService.sign).toHaveBeenCalled();
        });

        it('should throw if wallet is not initialized', async () => {
            // Arrange
            walletService.getPublicKey.mockImplementation(() => {
                throw new Error('Wallet not initialized');
            });

            // Act & Assert
            await expect(didService.createDID())
                .rejects
                .toThrow('Wallet not initialized');
        });
    });

    describe('verifyDID', () => {
        it('should verify a valid DID document', async () => {
            // Arrange
            const did = await didService.createDID();
            walletService.verify.mockResolvedValue(true);

            // Act
            const result = await didService.verifyDID(did);

            // Assert
            expect(result).toBe(true);
            expect(walletService.verify).toHaveBeenCalled();
        });

        it('should return false for invalid DID document', async () => {
            // Arrange
            const did = await didService.createDID();
            walletService.verify.mockResolvedValue(false);

            // Act
            const result = await didService.verifyDID(did);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('resolveDID', () => {
        it('should resolve an existing DID', async () => {
            // Arrange
            const did = await didService.createDID();

            // Act
            const result = await didService.resolveDID(did.id);

            // Assert
            expect(result.didDocument.id).toBe(did.id);
            expect(result.didResolutionMetadata.contentType).toBe('application/did+json');
        });

        it('should throw for non-existent DID', async () => {
            // Act & Assert
            await expect(didService.resolveDID('did:midnight:nonexistent'))
                .rejects
                .toThrow('DID not found');
        });
    });
});
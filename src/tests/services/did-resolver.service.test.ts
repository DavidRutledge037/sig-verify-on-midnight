import { DIDResolverService } from '../../services/did-resolver.service';
import { DIDStorageService } from '../../services/did-storage.service';
import { MidnightDIDMethod } from '../../services/did-methods';
import { DIDDocument } from '../../services/did.service';

describe('DID Resolver Service', () => {
    let resolverService: DIDResolverService;
    let storageService: DIDStorageService;
    let testDID: DIDDocument;

    beforeEach(async () => {
        // Mock storage service
        storageService = new DIDStorageService();
        jest.spyOn(storageService, 'initialize').mockResolvedValue();
        jest.spyOn(storageService, 'getDID').mockImplementation(async (id: string) => {
            if (id === 'did:midnight:revoked') {
                return {
                    id: 'did:midnight:revoked',
                    controller: 'test_controller',
                    verificationMethod: [{
                        id: 'did:midnight:revoked#keys-1',
                        type: 'Secp256k1VerificationKey2018',
                        controller: 'did:midnight:revoked',
                        publicKeyHex: 'test_key'
                    }],
                    created: new Date().toISOString(),
                    updated: new Date().toISOString(),
                    revoked: true,
                    revocationReason: 'Test revocation'
                };
            }
            if (id === testDID?.id) {
                return testDID;
            }
            return null;
        });

        // Create test DID
        testDID = {
            id: 'did:midnight:test',
            controller: 'test_controller',
            verificationMethod: [{
                id: 'did:midnight:test#keys-1',
                type: 'Secp256k1VerificationKey2018',
                controller: 'did:midnight:test',
                publicKeyHex: 'test_key'
            }],
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        // Initialize resolver with methods
        const methods = [new MidnightDIDMethod()];
        resolverService = new DIDResolverService(methods, storageService);
    });

    it('should resolve an existing DID', async () => {
        const result = await resolverService.resolve(testDID.id);
        expect(result.status).toBe('active');
        expect(result.didDocument).toBeDefined();
    });

    it('should handle non-existent DID', async () => {
        const result = await resolverService.resolve('did:midnight:nonexistent');
        expect(result.status).toBe('not-found');
        expect(result.didDocument).toBeNull();
    });

    it('should handle invalid DID format', async () => {
        const result = await resolverService.resolve('invalid:did:format');
        expect(result.status).toBe('not-found');
        expect(result.error).toBeDefined();
    });

    it('should handle revoked DID', async () => {
        const result = await resolverService.resolve('did:midnight:revoked');
        expect(result.status).toBe('revoked');
        expect(result.didDocument).toBeDefined();
        expect(result.didDocument?.revoked).toBe(true);
    });
}); 
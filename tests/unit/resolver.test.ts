import { jest } from '@jest/globals';
import { DIDResolver } from '../../src/identity/resolver';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { createMockStorageService } from '../utils/service-mocks';
import { createAsyncMockFn } from '../utils/mock-utils';
import { DIDDocument } from '../../src/types/did.types';

describe('DID Resolver Tests', () => {
    let resolver: DIDResolver;
    let mockStorageService: jest.Mocked<DIDStorageService>;
    
    const testDID: DIDDocument = {
        id: 'did:midnight:test123',
        controller: 'did:midnight:controller123',
        verificationMethod: [{
            id: 'did:midnight:test123#key-1',
            type: 'Ed25519VerificationKey2020',
            controller: 'did:midnight:test123',
            publicKeyHex: '123456'
        }],
        authentication: ['did:midnight:test123#key-1'],
        assertionMethod: ['did:midnight:test123#key-1'],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };

    beforeEach(() => {
        mockStorageService = createMockStorageService();
        mockStorageService.getDID.mockResolvedValue(testDID);
        mockStorageService.exists.mockResolvedValue(true);
        mockStorageService.getDIDsByController.mockResolvedValue([testDID]);
        mockStorageService.getDIDsByStatus.mockResolvedValue([testDID]);
        
        resolver = new DIDResolver(mockStorageService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should resolve a DID', async () => {
        const result = await resolver.resolve('did:midnight:test123');
        expect(result.didDocument).toEqual(testDID);
        expect(mockStorageService.getDID).toHaveBeenCalledWith('did:midnight:test123');
    });

    it('should return null for non-existent DID', async () => {
        mockStorageService.getDID.mockResolvedValue(null);
        const result = await resolver.resolve('did:midnight:nonexistent');
        expect(result).toBeNull();
    });

    it('should verify DID existence', async () => {
        const exists = await resolver.exists('did:midnight:test123');
        expect(exists).toBe(true);
        expect(mockStorageService.exists).toHaveBeenCalledWith('did:midnight:test123');
    });

    it('should get DIDs by controller', async () => {
        const dids = await resolver.getByController('did:midnight:controller123');
        expect(dids).toEqual([testDID]);
        expect(mockStorageService.getDIDsByController).toHaveBeenCalledWith('did:midnight:controller123');
    });
}); 
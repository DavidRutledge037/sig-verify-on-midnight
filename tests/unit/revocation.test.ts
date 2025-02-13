import { jest } from '@jest/globals';
import { DIDRevocationService } from '../../src/services/revocation.service';
import { createMockStorageService, createMockWalletService, createMockKeyManager } from '../utils/service-mocks';
import { DIDDocument } from '../../src/types/did.types';
import { KeyPair } from '../../src/types/key.types';

describe('DID Revocation Service Tests', () => {
    let revocationService: DIDRevocationService;
    let mockStorageService: jest.Mocked<DIDStorageService>;
    let mockWalletService: jest.Mocked<WalletService>;
    
    const mockKeyPair: KeyPair = {
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    };

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
        updated: new Date().toISOString(),
        status: 'active'
    };

    beforeEach(() => {
        mockStorageService = createMockStorageService();
        mockWalletService = createMockWalletService();

        // Set up specific mock implementations
        mockStorageService.getDID.mockResolvedValue(testDID);
        mockStorageService.updateDID.mockResolvedValue(true);
        mockWalletService.getClient.mockResolvedValue({
            signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
        });

        revocationService = new DIDRevocationService(mockStorageService, mockWalletService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should revoke a DID', async () => {
        const result = await revocationService.revokeDID('did:midnight:test123');
        expect(result).toBe(true);
        expect(mockStorageService.getDID).toHaveBeenCalledWith('did:midnight:test123');
        expect(mockStorageService.updateDID).toHaveBeenCalled();
    });

    it('should fail to revoke non-existent DID', async () => {
        mockStorageService.getDID.mockResolvedValue(null);
        await expect(revocationService.revokeDID('did:midnight:nonexistent'))
            .rejects.toThrow('DID not found');
    });

    it('should fail to revoke already revoked DID', async () => {
        const revokedDID = { ...testDID, status: 'revoked' };
        mockStorageService.getDID.mockResolvedValue(revokedDID);
        await expect(revocationService.revokeDID('did:midnight:test123'))
            .rejects.toThrow('DID is already revoked');
    });
}); 
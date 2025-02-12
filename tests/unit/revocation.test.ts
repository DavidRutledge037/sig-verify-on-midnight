import { jest } from '@jest/globals';
import { DIDRevocationService } from '../../src/services/did-revocation.service';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { WalletService } from '../../src/services/wallet.service';
import { DIDDocument } from '../../src/types/did.types';

describe('DID Revocation Service Tests', () => {
    let revocationService: DIDRevocationService;
    let mockStorageService: jest.Mocked<DIDStorageService>;
    let mockWalletService: jest.Mocked<WalletService>;

    const mockKeyPair = {
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    };

    beforeEach(() => {
        mockStorageService = {
            getDID: jest.fn(),
            storeDID: jest.fn(),
            updateDID: jest.fn(),
            deleteDID: jest.fn(),
            initialize: jest.fn(),
            getDIDsByController: jest.fn(),
            getDIDsByStatus: jest.fn(),
            exists: jest.fn()
        } as jest.Mocked<DIDStorageService>;

        mockWalletService = {
            keyManager: {
                generateKeyPair: jest.fn().mockResolvedValue(mockKeyPair),
                sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
                verify: jest.fn().mockResolvedValue(true),
                deriveAddress: jest.fn().mockReturnValue('midnight1test123')
            },
            wallet: {
                address: 'midnight1test123',
                pubkey: new Uint8Array([1, 2, 3])
            },
            client: {
                signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
            },
            currentKeyPair: mockKeyPair,
            createWallet: jest.fn().mockResolvedValue(undefined),
            sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            verify: jest.fn().mockResolvedValue(true),
            getAddress: jest.fn().mockReturnValue('midnight1test123'),
            initialize: jest.fn().mockResolvedValue(undefined),
            getClient: jest.fn().mockResolvedValue({
                signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
            }),
            getBalance: jest.fn().mockResolvedValue('1000'),
            displayBalance: jest.fn().mockReturnValue('1.0 NIGHT'),
            signMessage: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
        } as unknown as jest.Mocked<WalletService>;

        revocationService = new DIDRevocationService(mockStorageService, mockWalletService);
    });

    const testDID: DIDDocument = {
        id: 'did:midnight:test123',
        controller: 'did:midnight:controller123',
        verificationMethod: [],
        authentication: [],
        assertionMethod: [],
        keyAgreement: [],
        capabilityInvocation: [],
        capabilityDelegation: [],
        service: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        status: 'active'
    };

    it('should revoke a DID', async () => {
        mockStorageService.getDID.mockResolvedValue(testDID);
        mockStorageService.updateDID.mockResolvedValue(true);

        const result = await revocationService.revokeDID(testDID.id);
        expect(result).toBe(true);
        expect(mockStorageService.updateDID).toHaveBeenCalledWith({
            ...testDID,
            status: 'revoked',
            updated: expect.any(String)
        });
    });

    it('should not revoke an already revoked DID', async () => {
        const revokedDID = { ...testDID, status: 'revoked' };
        mockStorageService.getDID.mockResolvedValue(revokedDID);

        const result = await revocationService.revokeDID(revokedDID.id);
        expect(result).toBe(false);
        expect(mockStorageService.updateDID).not.toHaveBeenCalled();
    });

    it('should handle non-existent DID', async () => {
        mockStorageService.getDID.mockResolvedValue(null);

        const result = await revocationService.revokeDID('did:midnight:nonexistent');
        expect(result).toBe(false);
        expect(mockStorageService.updateDID).not.toHaveBeenCalled();
    });

    it('should verify revocation status', async () => {
        const revokedDID = { ...testDID, status: 'revoked' };
        mockStorageService.getDID.mockResolvedValue(revokedDID);

        const isRevoked = await revocationService.isRevoked(revokedDID.id);
        expect(isRevoked).toBe(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
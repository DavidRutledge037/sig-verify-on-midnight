import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DIDService } from '../../src/services/did.service';
import { WalletService } from '../../src/services/wallet';

describe('DID Unit Tests', () => {
    let didService: DIDService;
    let mockWalletService: jest.Mocked<WalletService>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockWalletService = {
            getAddress: jest.fn(),
            sign: jest.fn(),
            verify: jest.fn(),
            createWallet: jest.fn()
        } as unknown as jest.Mocked<WalletService>;

        didService = new DIDService(mockWalletService);
    });

    it('should create DID with correct format', async () => {
        mockWalletService.getAddress.mockResolvedValue('test-address');
        
        const did = await didService.createDID();
        
        expect(did).toBeDefined();
        expect(did.id).toMatch(/^did:midnight:/);
        expect(did.controller).toBe('test-address');
        expect(Array.isArray(did.verificationMethod)).toBe(true);
        expect(Array.isArray(did.authentication)).toBe(true);
    });

    it('should validate DID format', () => {
        expect(didService.isValidDIDFormat('did:midnight:test')).toBe(true);
        expect(didService.isValidDIDFormat('invalid:did:format')).toBe(false);
        expect(didService.isValidDIDFormat('not-a-did')).toBe(false);
    });

    // ... rest of tests ...
}); 
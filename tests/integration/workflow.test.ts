import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { WalletService } from '../../src/services/wallet';
import { DIDService } from '../../src/services/did.service';
import { SignatureService } from '../../src/services/signature';
import { MidnightService } from '../../src/services/midnight';

describe('Workflow Integration', () => {
    let walletService: WalletService;
    let didService: DIDService;
    let signatureService: SignatureService;
    let mockMidnightService: jest.Mocked<MidnightService>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockMidnightService = {
            submitProof: jest.fn(),
            verifyProof: jest.fn(),
            getTransactionDetails: jest.fn(),
            getTx: jest.fn(),
            getHeight: jest.fn(),
            getBlock: jest.fn()
        } as unknown as jest.Mocked<MidnightService>;

        walletService = new WalletService();
        didService = new DIDService(walletService);
        signatureService = new SignatureService(walletService, mockMidnightService);
    });

    it('should complete full workflow', async () => {
        // Create DID
        const did = await didService.createDID();
        expect(did).toBeDefined();
        expect(did.id).toMatch(/^did:midnight:/);

        // Sign data with DID
        const data = 'test-data';
        const signature = await signatureService.sign(data);
        expect(signature).toBeDefined();

        // Verify signature
        const isValid = await signatureService.verify(data, signature);
        expect(isValid).toBe(true);
    });

    // ... rest of tests ...
}); 
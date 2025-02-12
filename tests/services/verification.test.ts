import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { VerificationService } from '../../src/services/verification';
import { MidnightService } from '../../src/services/midnight';

// Mock MidnightService
jest.mock('../../src/services/midnight');

describe('VerificationService', () => {
    let verificationService: VerificationService;
    let mockMidnightService: jest.Mocked<MidnightService>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Create mock instance
        mockMidnightService = {
            verifyTransaction: jest.fn(),
            getTransactionDetails: jest.fn(),
            submitProof: jest.fn()
        } as unknown as jest.Mocked<MidnightService>;

        // Initialize service
        verificationService = new VerificationService(mockMidnightService);
    });

    it('should verify transaction', async () => {
        mockMidnightService.verifyTransaction.mockResolvedValue(true);
        const result = await verificationService.verify('test-tx');
        expect(result).toBe(true);
    });

    // ... rest of tests ...
}); 
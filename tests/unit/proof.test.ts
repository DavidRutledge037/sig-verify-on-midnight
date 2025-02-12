import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ProofService } from '../../src/services/proof';
import { MidnightService } from '../../src/services/midnight';
import { TransactionDetails } from '../../src/types/transaction';

describe('Proof Unit Tests', () => {
    let proofService: ProofService;
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

        proofService = new ProofService('http://localhost:1234', 'test-chain-1');
        (proofService as any).midnightService = mockMidnightService;
    });

    it('should submit proof', async () => {
        const testProof = {
            type: 'test',
            value: 'test-value'
        };

        mockMidnightService.submitProof.mockResolvedValue('test-tx-hash');
        
        const result = await proofService.submitProof(testProof);
        
        expect(result).toBe('test-tx-hash');
        expect(mockMidnightService.submitProof).toHaveBeenCalledWith(testProof);
    });

    it('should verify proof', async () => {
        const testTx: TransactionDetails = {
            hash: 'test-hash',
            height: 1,
            index: 0,
            proof: { type: 'test', value: 'test-value' },
            tx: new Uint8Array(),
            transactionHash: 'test-hash',
            blockHeight: 1,
            timestamp: new Date(),
            gasUsed: 0,
            fee: '0'
        };

        mockMidnightService.getTransactionDetails.mockResolvedValue(testTx);
        mockMidnightService.verifyProof.mockResolvedValue(true);
        
        const result = await proofService.verifyProof('test-hash');
        
        expect(result).toBe(true);
        expect(mockMidnightService.getTransactionDetails).toHaveBeenCalledWith('test-hash');
        expect(mockMidnightService.verifyProof).toHaveBeenCalled();
    });

    // ... rest of tests ...
}); 
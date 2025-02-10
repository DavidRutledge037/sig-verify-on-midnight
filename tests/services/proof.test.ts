import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProofService } from '../../src/services/proof';
import { MidnightService } from '../../src/services/midnight';

// Mock MidnightService
vi.mock('../../src/services/midnight', () => ({
    MidnightService: vi.fn()
}));

describe('ProofService', () => {
    const mockTxDetails = {
        transactionHash: 'mock_tx_hash',
        blockHeight: 1000,
        timestamp: new Date('2024-02-10T12:00:00Z'),
        gasUsed: 50000,
        fee: '1000'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (MidnightService as any).mockImplementation(() => ({
            connect: vi.fn(),
            disconnect: vi.fn(),
            queryDID: vi.fn(),
            queryDocument: vi.fn(),
            getTransactionDetails: vi.fn()
        }));
    });

    it('should get DID proof', async () => {
        const service = new ProofService('http://localhost:26657', 'midnight-1');
        const mockDID = 'did:midnight:test';

        const mockMidnight = (MidnightService as any).mock.results[0].value;
        mockMidnight.queryDID.mockResolvedValue({
            transactionHash: mockTxDetails.transactionHash
        });
        mockMidnight.getTransactionDetails.mockResolvedValue(mockTxDetails);

        const proof = await service.getDIDProof(mockDID);

        expect(proof).toEqual({
            type: 'DID',
            value: mockDID,
            timestamp: mockTxDetails.timestamp,
            blockHeight: mockTxDetails.blockHeight,
            transactionHash: mockTxDetails.transactionHash
        });
    });

    it('should get hash proof', async () => {
        const service = new ProofService('http://localhost:26657', 'midnight-1');
        const mockHash = 'zhash123';

        const mockMidnight = (MidnightService as any).mock.results[0].value;
        mockMidnight.queryDocument.mockResolvedValue({
            transactionHash: mockTxDetails.transactionHash
        });
        mockMidnight.getTransactionDetails.mockResolvedValue(mockTxDetails);

        const proof = await service.getHashProof(mockHash);

        expect(proof).toEqual({
            type: 'Hash',
            value: mockHash,
            timestamp: mockTxDetails.timestamp,
            blockHeight: mockTxDetails.blockHeight,
            transactionHash: mockTxDetails.transactionHash
        });
    });

    it('should verify valid proof', async () => {
        const service = new ProofService('http://localhost:26657', 'midnight-1');
        const proof = {
            type: 'DID' as const,
            value: 'did:midnight:test',
            timestamp: mockTxDetails.timestamp,
            blockHeight: mockTxDetails.blockHeight,
            transactionHash: mockTxDetails.transactionHash
        };

        const mockMidnight = (MidnightService as any).mock.results[0].value;
        mockMidnight.getTransactionDetails.mockResolvedValue(mockTxDetails);
        mockMidnight.queryDID.mockResolvedValue({
            transactionHash: mockTxDetails.transactionHash
        });

        const isValid = await service.verifyProof(proof);
        expect(isValid).toBe(true);
    });

    it('should reject invalid proof', async () => {
        const service = new ProofService('http://localhost:26657', 'midnight-1');
        const proof = {
            type: 'DID' as const,
            value: 'did:midnight:test',
            timestamp: new Date(),
            blockHeight: 999,
            transactionHash: 'wrong_hash'
        };

        const mockMidnight = (MidnightService as any).mock.results[0].value;
        mockMidnight.getTransactionDetails.mockResolvedValue(null);

        const isValid = await service.verifyProof(proof);
        expect(isValid).toBe(false);
    });
}); 
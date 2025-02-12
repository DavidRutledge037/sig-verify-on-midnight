import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { MidnightService } from '../../src/services/midnight';
import { TransactionDetails, Block } from '../../src/types/transaction';

describe('Midnight Unit Tests', () => {
    let midnightService: MidnightService;
    let mockFetch: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock global fetch
        mockFetch = jest.fn();
        global.fetch = mockFetch;

        midnightService = new MidnightService('http://localhost:1234', 'test-chain-1');
    });

    it('should get transaction details', async () => {
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

        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(testTx)
        });

        const result = await midnightService.getTransactionDetails('test-hash');
        
        expect(result).toEqual(testTx);
        expect(mockFetch).toHaveBeenCalled();
    });

    it('should get block', async () => {
        const testBlock: Block = {
            header: {
                height: '1',
                time: new Date().toISOString(),
                chain_id: 'test-chain-1'
            },
            data: {
                txs: []
            }
        };

        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(testBlock)
        });

        const result = await midnightService.getBlock(1);
        
        expect(result).toEqual(testBlock);
        expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found'
        });

        await expect(midnightService.getTransactionDetails('nonexistent'))
            .rejects.toThrow('API request failed: 404 Not Found');
    });

    // ... rest of tests ...
}); 
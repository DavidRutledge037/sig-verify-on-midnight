import { jest } from '@jest/globals';
import { ReportingService } from '../../src/services/reporting.service';
import { MidnightClient } from '../../src/clients/midnight.client';
import { Block, IndexedTx } from '@cosmjs/stargate';

describe('Reporting Service Tests', () => {
    let reportingService: ReportingService;
    let mockClient: jest.Mocked<MidnightClient>;

    const mockTx: IndexedTx = {
        height: 100,
        hash: 'hash123',
        code: 0,
        rawLog: '',
        tx: new Uint8Array([1, 2, 3]),
        gasUsed: 100000,
        gasWanted: 200000
    };

    const mockBlock: Block = {
        header: {
            version: { block: 1, app: 1 },
            chainId: 'test-chain-1',
            height: 100,
            time: new Date(),
            lastBlockId: {
                hash: new Uint8Array([1, 2, 3]),
                partSetHeader: { total: 1, hash: new Uint8Array([4, 5, 6]) }
            },
            lastCommitHash: new Uint8Array([7, 8, 9]),
            dataHash: new Uint8Array([10, 11, 12]),
            validatorsHash: new Uint8Array([13, 14, 15]),
            nextValidatorsHash: new Uint8Array([16, 17, 18]),
            consensusHash: new Uint8Array([19, 20, 21]),
            appHash: new Uint8Array([22, 23, 24]),
            lastResultsHash: new Uint8Array([25, 26, 27]),
            evidenceHash: new Uint8Array([28, 29, 30]),
            proposerAddress: new Uint8Array([31, 32, 33])
        },
        data: { txs: [] },
        evidence: { evidence: [] },
        lastCommit: {
            height: 99,
            round: 0,
            blockId: {
                hash: new Uint8Array([1, 2, 3]),
                partSetHeader: { total: 1, hash: new Uint8Array([4, 5, 6]) }
            },
            signatures: []
        }
    };

    beforeEach(() => {
        mockClient = {
            getTx: jest.fn(),
            getHeight: jest.fn(),
            getBlock: jest.fn(),
            connect: jest.fn(),
            disconnect: jest.fn()
        } as jest.Mocked<MidnightClient>;

        reportingService = new ReportingService(mockClient);
    });

    it('should get transaction details', async () => {
        mockClient.getTx.mockResolvedValue(mockTx);
        const result = await reportingService.getTransactionDetails('hash123');
        expect(result).toEqual(mockTx);
        expect(mockClient.getTx).toHaveBeenCalledWith('hash123');
    });

    it('should get block details', async () => {
        mockClient.getHeight.mockResolvedValue(100);
        mockClient.getBlock.mockResolvedValue(mockBlock);

        const result = await reportingService.getBlockDetails(100);
        expect(result).toEqual(mockBlock);
        expect(mockClient.getBlock).toHaveBeenCalledWith(100);
    });

    it('should handle non-existent transaction', async () => {
        mockClient.getTx.mockResolvedValue(null);
        const result = await reportingService.getTransactionDetails('nonexistent');
        expect(result).toBeNull();
    });

    it('should handle block fetch error', async () => {
        const error = new Error('Block not found');
        mockClient.getBlock.mockRejectedValue(error);
        await expect(reportingService.getBlockDetails(999))
            .rejects.toThrow('Block not found');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 
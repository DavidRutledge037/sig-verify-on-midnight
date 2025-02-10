import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportingService } from '../../src/services/reporting';
import { StargateClient } from '@cosmjs/stargate';

describe('ReportingService', () => {
    // Mock StargateClient
    const mockClient = {
        getTx: vi.fn(),
        getBlock: vi.fn(),
        getHeight: vi.fn()
    } as unknown as StargateClient;

    const service = new ReportingService(mockClient);

    beforeEach(() => {
        vi.resetAllMocks();
        service.clearCache();
    });

    it('should generate transaction report', async () => {
        const mockTx = {
            height: 100,
            timestamp: '2024-02-10T00:00:00Z',
            gasUsed: 50000,
            fee: { amount: [{ amount: '1000' }] },
            events: [{
                type: 'transfer',
                attributes: [
                    { key: Buffer.from('sender'), value: Buffer.from('addr1') },
                    { key: Buffer.from('recipient'), value: Buffer.from('addr2') }
                ]
            }],
            code: 0
        };

        mockClient.getTx.mockResolvedValueOnce(mockTx);

        const report = await service.getTransactionReport('mock-hash');

        expect(report).toBeDefined();
        expect(report?.hash).toBe('mock-hash');
        expect(report?.success).toBe(true);
        expect(report?.events[0].type).toBe('transfer');
    });

    it('should calculate network stats', async () => {
        mockClient.getHeight.mockResolvedValue(100);
        mockClient.getBlock.mockResolvedValue({
            header: { time: '2024-02-10T00:00:00Z' },
            txs: ['tx1', 'tx2']
        });

        const mockTx = {
            height: 100,
            timestamp: '2024-02-10T00:00:00Z',
            gasUsed: 50000,
            fee: { amount: [{ amount: '1000' }] },
            events: [],
            code: 0
        };

        mockClient.getTx.mockResolvedValue(mockTx);

        const stats = await service.getNetworkStats(98, 100);

        expect(stats.totalTransactions).toBeGreaterThan(0);
        expect(stats.averageGasUsed).toBeGreaterThan(0);
        expect(stats.successRate).toBeGreaterThan(0);
    });
}); 
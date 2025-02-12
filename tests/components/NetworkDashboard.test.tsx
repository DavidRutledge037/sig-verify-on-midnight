import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { NetworkDashboard } from '../../src/components/NetworkDashboard';
import { StargateClient } from '@cosmjs/stargate';
import { ReportingService } from '../../src/services/reporting';
import { vi } from 'vitest';

// Mock StargateClient and ReportingService
vi.mock('@cosmjs/stargate', () => ({
    StargateClient: {
        connect: vi.fn()
    }
}));

vi.mock('../../src/services/reporting', () => ({
    ReportingService: vi.fn()
}));

describe('NetworkDashboard', () => {
    let mockMonitorCallback: (report: any) => void;
    
    const mockClient = {
        getHeight: vi.fn().mockResolvedValue(1000),
        getBlock: vi.fn().mockResolvedValue({
            header: { time: new Date().toISOString() },
            txs: ['tx1', 'tx2']
        }),
        getTx: vi.fn().mockResolvedValue({
            height: 1000,
            hash: 'mock_hash',
            gasUsed: 50000,
            code: 0,
            events: [],
            fee: {
                amount: [{ amount: '1000', denom: 'umid' }],
                gas: '200000'
            },
            timestamp: new Date().toISOString()
        })
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (StargateClient.connect as any).mockResolvedValue(mockClient);
        
        // Mock ReportingService implementation
        (ReportingService as any).mockImplementation(() => ({
            getNetworkStats: vi.fn().mockResolvedValue({
                totalTransactions: 201,
                averageGasUsed: 50050,
                averageBlockTime: 0,
                successRate: 1
            }),
            monitorTransactions: vi.fn((callback) => {
                mockMonitorCallback = callback;
            }),
            clearCache: vi.fn()
        }));
    });

    it('renders network stats', async () => {
        render(<NetworkDashboard nodeUrl="http://localhost:26657" />);

        await waitFor(() => {
            expect(screen.getByText('201')).toBeInTheDocument();
            expect(screen.getByText('50,050')).toBeInTheDocument();
        });
    });

    it('handles connection errors', async () => {
        (StargateClient.connect as any).mockRejectedValue(new Error('Connection failed'));

        render(<NetworkDashboard nodeUrl="http://localhost:26657" />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to connect to network/)).toBeInTheDocument();
        });
    });

    it('updates recent transactions', async () => {
        render(<NetworkDashboard nodeUrl="http://localhost:26657" />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('No recent transactions')).toBeInTheDocument();
        });

        // Simulate new transaction via the monitor callback
        await act(async () => {
            mockMonitorCallback({
                hash: 'new_tx_hash',
                blockHeight: 1001,
                timestamp: new Date(),
                gasUsed: 60000,
                success: true
            });
        });

        // Check for the transaction hash using the cell content
        await waitFor(() => {
            const hashCell = screen.getByText((content) => {
                return content.startsWith('new_tx_has') && content.endsWith('...');
            });
            expect(hashCell).toBeInTheDocument();
            expect(screen.queryByText('No recent transactions')).not.toBeInTheDocument();
        });
    });
}); 
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { WalletProvider } from '../../contexts/WalletContext';
import { WalletTransactions } from '../../components/WalletTransactions';

// Mock transaction data with required fields
const mockTransactions = [
    {
        id: '1',
        status: 'pending',
        hash: '0x1234567890abcdef1234567890abcdef12345678',
        type: 'transfer'
    }
];

const createWrapper = (transactions = []) => {
    return {
        transactions,
        addTransaction: vi.fn(),
        connect: vi.fn(),
        disconnect: vi.fn(),
        address: transactions.length ? '0x1234...5678' : null,
        isConnected: transactions.length > 0,
        chainId: transactions.length ? 1 : null,
        switchNetwork: vi.fn()
    };
};

describe('WalletTransactions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should display "No transactions yet" when empty', async () => {
        await act(async () => {
            render(
                <WalletProvider value={createWrapper()}>
                    <WalletTransactions />
                </WalletProvider>
            );
        });
        
        expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    });

    it('should display transaction when present', async () => {
        await act(async () => {
            render(
                <WalletProvider value={createWrapper(mockTransactions)}>
                    <WalletTransactions />
                </WalletProvider>
            );
        });
        
        expect(screen.queryByText('No transactions yet')).not.toBeInTheDocument();
        expect(screen.getByText('pending')).toBeInTheDocument();
    });

    it('should display transaction hash correctly', async () => {
        await act(async () => {
            render(
                <WalletProvider value={createWrapper(mockTransactions)}>
                    <WalletTransactions />
                </WalletProvider>
            );
        });
        
        // Check for the hash container
        const hashContainer = screen.getByText((content, element) => {
            return element?.className === 'hash' && 
                   content.includes('0x123456') && 
                   content.includes('345678');
        });
        
        expect(hashContainer).toBeInTheDocument();
    });
}); 
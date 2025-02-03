import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { WalletTransactions } from '../../components/WalletTransactions.js';
import { WalletProvider, useWallet } from '../../contexts/WalletContext.js';

// Create a wrapper component that can modify the context state
const TestWrapper = ({ initialTransactions = [], onMount = () => {} }) => {
    const { addTransaction } = useWallet();
    
    React.useLayoutEffect(() => {
        initialTransactions.forEach(tx => {
            addTransaction(tx);
        });
        onMount();
    }, []);

    return <WalletTransactions />;
};

// Component to handle status updates
const StatusUpdater = ({ hash, status }) => {
    const { updateTransactionStatus } = useWallet();
    
    React.useEffect(() => {
        updateTransactionStatus(hash, status);
    }, [hash, status]);

    return null;
};

describe('Wallet Transactions', () => {
    it('should display transaction history', async () => {
        const mockTransactions = [
            {
                hash: 'tx_123',
                type: 'Transfer',
                status: 'confirmed',
                timestamp: new Date()
            },
            {
                hash: 'tx_456',
                type: 'Transfer',
                status: 'pending',
                timestamp: new Date()
            }
        ];

        await act(async () => {
            render(
                <WalletProvider>
                    <TestWrapper initialTransactions={mockTransactions} />
                </WalletProvider>
            );
        });

        // Use findByText to wait for async updates
        expect(await screen.findByText(/tx_123/)).toBeInTheDocument();
        expect(await screen.findByText(/tx_456/)).toBeInTheDocument();
        expect(await screen.findByText('confirmed')).toBeInTheDocument();
        expect(await screen.findByText('pending')).toBeInTheDocument();
    });

    it('should update transaction status', async () => {
        const mockTransaction = {
            hash: 'tx_789',
            type: 'Transfer',
            status: 'pending',
            timestamp: new Date()
        };

        await act(async () => {
            render(
                <WalletProvider>
                    <TestWrapper initialTransactions={[mockTransaction]} />
                    <StatusUpdater hash="tx_789" status="confirmed" />
                </WalletProvider>
            );
        });

        // Initial state
        expect(await screen.findByText(/tx_789/)).toBeInTheDocument();
        expect(await screen.findByText('confirmed')).toBeInTheDocument();
    });
}); 
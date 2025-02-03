import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { WalletTransactions } from '../../components/WalletTransactions.js';
import { WalletProvider, useWallet } from '../../contexts/WalletContext.js';

// Create a wrapper component that can modify the context state
const TestWrapper = ({ initialTransactions = [] }) => {
    const { addTransaction } = useWallet();
    
    // Use layout effect to avoid state updates during render
    React.useLayoutEffect(() => {
        initialTransactions.forEach(tx => {
            addTransaction(tx);
        });
    }, []); // Only run once on mount

    return <WalletTransactions />;
};

describe('WalletTransactions', () => {
    it('should show no transactions message when empty', () => {
        render(
            <WalletProvider>
                <WalletTransactions />
            </WalletProvider>
        );
        
        expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    });

    it('should display transaction when present', async () => {
        const mockTransactions = [{
            hash: '0x123456789abcdef',
            type: 'Transfer',
            status: 'confirmed',
            timestamp: new Date()
        }];

        await act(async () => {
            render(
                <WalletProvider>
                    <TestWrapper initialTransactions={mockTransactions} />
                </WalletProvider>
            );
        });

        // Use findByText to wait for async updates
        expect(await screen.findByText('Transfer')).toBeInTheDocument();
        expect(await screen.findByText('confirmed')).toBeInTheDocument();
        
        // Use getByText with a regex to match the hash parts
        const hashElement = screen.getByText(/0x123456.*abcdef/);
        expect(hashElement).toBeInTheDocument();
    });
}); 
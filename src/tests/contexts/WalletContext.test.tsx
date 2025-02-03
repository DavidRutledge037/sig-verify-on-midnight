import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WalletProvider, useWallet } from '../../contexts/WalletContext.js';
import { mockMidnightWallet } from '../mocks/walletMock.js';

// Test component that uses wallet context
function TestComponent() {
    const { wallet, connect, disconnect } = useWallet();
    return (
        <div>
            {wallet && <div data-testid="wallet-address">{wallet.address}</div>}
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
        </div>
    );
}

describe('WalletContext', () => {
    beforeEach(() => {
        // @ts-ignore
        global.window.midnight = mockMidnightWallet;
        jest.clearAllMocks();
    });

    it('should connect wallet', async () => {
        render(
            <WalletProvider>
                <TestComponent />
            </WalletProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText('Connect'));
        });

        expect(mockMidnightWallet.connect).toHaveBeenCalled();
    });

    it('should handle wallet not installed', async () => {
        // @ts-ignore
        delete global.window.midnight;

        render(
            <WalletProvider>
                <TestComponent />
            </WalletProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText('Connect'));
        });

        expect(screen.getByTestId('wallet-error')).toHaveTextContent('NOT_INSTALLED');
    });

    it('should disconnect wallet', async () => {
        render(
            <WalletProvider>
                <TestComponent />
            </WalletProvider>
        );

        // Connect first
        await act(async () => {
            fireEvent.click(screen.getByText('Connect'));
        });

        // Then disconnect
        await act(async () => {
            fireEvent.click(screen.getByText('Disconnect'));
        });

        expect(mockMidnightWallet.disconnect).toHaveBeenCalled();
        expect(screen.queryByTestId('wallet-address')).not.toBeInTheDocument();
    });
}); 
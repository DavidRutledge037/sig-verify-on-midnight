import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { WalletConnect } from '../../components/WalletConnect';
import { WalletContext } from '../../contexts/WalletContext';
import { act } from 'react-dom/test-utils';

const mockWalletContext = {
    isConnected: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    getAddress: vi.fn(),
    signMessage: vi.fn(),
};

describe('WalletConnect', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should render connect button when not connected', () => {
        render(
            <WalletContext.Provider value={mockWalletContext}>
                <WalletConnect />
            </WalletContext.Provider>
        );
        expect(screen.getByText('Connect Lace Wallet')).toBeInTheDocument();
    });

    it('should handle successful connection', async () => {
        mockWalletContext.connect.mockResolvedValueOnce(undefined);
        
        render(
            <WalletContext.Provider value={mockWalletContext}>
                <WalletConnect />
            </WalletContext.Provider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText('Connect Lace Wallet'));
        });
        
        expect(mockWalletContext.connect).toHaveBeenCalled();
    });

    it('should handle connection failure', async () => {
        mockWalletContext.connect.mockRejectedValueOnce(new Error('Connection failed'));
        
        render(
            <WalletContext.Provider value={mockWalletContext}>
                <WalletConnect />
            </WalletContext.Provider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText('Connect Lace Wallet'));
        });

        await waitFor(() => {
            expect(screen.getByText('Failed to connect. Please try again.')).toBeInTheDocument();
        });
    });
});

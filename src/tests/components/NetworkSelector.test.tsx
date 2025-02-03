import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { NetworkSelector } from '../../components/NetworkSelector.js';
import { WalletProvider } from '../../contexts/WalletContext.js';
import { NotificationProvider } from '../../contexts/NotificationContext.js';
import { mockMidnightWallet } from '../mocks/walletMock.js';
import { jest, beforeEach, describe, it, expect } from '@jest/globals';

// Mock the SDK
const mockSDK = {
    getNetwork: jest.fn(),
    switchNetwork: jest.fn()
};

// Mock the notification context
jest.mock('../../contexts/NotificationContext.js', () => ({
    ...jest.requireActual('../../contexts/NotificationContext.js'),
    useNotification: () => ({
        showNotification: jest.fn((message) => {
            // Create notification element for testing
            const div = document.createElement('div');
            div.textContent = message;
            div.setAttribute('data-testid', 'notification');
            document.body.appendChild(div);
        })
    })
}));

describe('NetworkSelector', () => {
    beforeEach(() => {
        // Reset mocks and DOM
        jest.clearAllMocks();
        document.body.innerHTML = '';
        mockSDK.getNetwork.mockResolvedValue('midnight-1');
        mockSDK.switchNetwork.mockResolvedValue(undefined);
    });

    it('should render network options', async () => {
        await act(async () => {
            render(
                <NotificationProvider>
                    <WalletProvider sdk={mockSDK}>
                        <NetworkSelector />
                    </WalletProvider>
                </NotificationProvider>
            );
        });

        expect(screen.getByText('Mainnet')).toBeInTheDocument();
        expect(screen.getByText('Testnet')).toBeInTheDocument();
    });

    it('should handle network switch', async () => {
        await act(async () => {
            render(
                <NotificationProvider>
                    <WalletProvider sdk={mockSDK}>
                        <NetworkSelector />
                    </WalletProvider>
                </NotificationProvider>
            );
        });

        const select = screen.getByTestId('network-selector');
        
        await act(async () => {
            fireEvent.change(select, { target: { value: 'midnight-testnet' } });
        });

        await waitFor(() => {
            expect(mockSDK.switchNetwork).toHaveBeenCalledWith('midnight-testnet');
            expect(screen.getByTestId('notification')).toHaveTextContent(/Switched to midnight-testnet/);
        });
    });

    it('should handle network switch errors', async () => {
        mockSDK.switchNetwork.mockRejectedValueOnce(new Error('Failed to switch network'));

        await act(async () => {
            render(
                <NotificationProvider>
                    <WalletProvider sdk={mockSDK}>
                        <NetworkSelector />
                    </WalletProvider>
                </NotificationProvider>
            );
        });

        const select = screen.getByTestId('network-selector');
        
        await act(async () => {
            fireEvent.change(select, { target: { value: 'midnight-testnet' } });
        });

        await waitFor(() => {
            expect(screen.getByTestId('notification')).toHaveTextContent(/Failed to switch network/);
        });
    });
}); 
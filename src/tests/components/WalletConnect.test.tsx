import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletConnect } from '../../components/WalletConnect.js';
import { WalletProvider } from '../../contexts/WalletContext.js';
import { NotificationProvider } from '../../contexts/NotificationContext.js';
import { mockMidnightWallet } from '../mocks/walletMock.js';

describe('WalletConnect', () => {
    beforeEach(() => {
        // @ts-ignore
        global.window.midnight = mockMidnightWallet;
        jest.clearAllMocks();
    });

    it('should render connect button when not connected', () => {
        render(
            <NotificationProvider>
                <WalletProvider>
                    <WalletConnect />
                </WalletProvider>
            </NotificationProvider>
        );

        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should show wallet info when connected', async () => {
        render(
            <NotificationProvider>
                <WalletProvider>
                    <WalletConnect />
                </WalletProvider>
            </NotificationProvider>
        );

        await fireEvent.click(screen.getByText('Connect Wallet'));

        expect(screen.getByText('1234...5678')).toBeInTheDocument();
        expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });

    it('should handle connection errors', async () => {
        mockMidnightWallet.connect.mockRejectedValueOnce(new Error('Connection failed'));

        render(
            <NotificationProvider>
                <WalletProvider>
                    <WalletConnect />
                </WalletProvider>
            </NotificationProvider>
        );

        await fireEvent.click(screen.getByText('Connect Wallet'));

        expect(screen.getByText('Failed to connect wallet. Please try again.')).toBeInTheDocument();
    });
}); 
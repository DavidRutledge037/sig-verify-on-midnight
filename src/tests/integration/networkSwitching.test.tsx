import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WalletProvider } from '../../contexts/WalletContext.js';
import { NetworkSelector } from '../../components/NetworkSelector.js';
import { NotificationProvider } from '../../contexts/NotificationContext.js';
import { mockMidnightWallet } from '../mocks/walletMock.js';
import { jest, beforeEach, describe, it, expect } from '@jest/globals';

describe('Network Switching', () => {
    beforeEach(() => {
        // @ts-ignore
        global.window.midnight = mockMidnightWallet;
        jest.clearAllMocks();
    });

    it('should handle network switch and reinitialize wallet', async () => {
        mockMidnightWallet.getNetwork
            .mockResolvedValueOnce('midnight-1')
            .mockResolvedValueOnce('midnight-testnet');

        render(
            <NotificationProvider>
                <WalletProvider>
                    <NetworkSelector />
                </WalletProvider>
            </NotificationProvider>
        );

        const select = screen.getByRole('combobox');
        
        await act(async () => {
            fireEvent.change(select, { target: { value: 'midnight-testnet' } });
        });

        expect(mockMidnightWallet.switchNetwork).toHaveBeenCalledWith('midnight-testnet');
        expect(mockMidnightWallet.getAddress).toHaveBeenCalled();
        expect(mockMidnightWallet.getPublicKey).toHaveBeenCalled();
        expect(screen.getByText('Switched to midnight-testnet')).toBeInTheDocument();
    });

    it('should handle network switch errors', async () => {
        mockMidnightWallet.switchNetwork.mockRejectedValueOnce(
            new Error('Network switch failed')
        );

        render(
            <NotificationProvider>
                <WalletProvider>
                    <NetworkSelector />
                </WalletProvider>
            </NotificationProvider>
        );

        const select = screen.getByRole('combobox');
        
        await act(async () => {
            fireEvent.change(select, { target: { value: 'midnight-testnet' } });
        });

        expect(screen.getByText('Failed to switch network')).toBeInTheDocument();
    });
}); 
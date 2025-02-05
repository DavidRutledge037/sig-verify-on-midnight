import React from 'react';
import { WalletContext } from '../contexts/WalletContext';

export const mockWalletContext = {
    isConnected: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    getAddress: vi.fn(),
    signMessage: vi.fn(),
};

export const WalletProviderWrapper: React.FC<{
    children: React.ReactNode;
    value?: Partial<typeof mockWalletContext>;
}> = ({ children, value = {} }) => {
    return (
        <WalletContext.Provider value={{ ...mockWalletContext, ...value }}>
            {children}
        </WalletContext.Provider>
    );
}; 
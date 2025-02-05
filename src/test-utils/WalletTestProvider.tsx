import React from 'react';
import { WalletContext } from '../contexts/WalletContext';

const defaultWalletContext = {
    isConnected: false,
    connect: async () => {},
    disconnect: async () => {},
    getAddress: async () => null as string | null,
    signMessage: async (message: string) => null as string | null,
};

export const WalletTestProvider: React.FC<{
    children: React.ReactNode;
    value?: Partial<typeof defaultWalletContext>;
}> = ({ children, value = {} }) => {
    return (
        <WalletContext.Provider value={{ ...defaultWalletContext, ...value }}>
            {children}
        </WalletContext.Provider>
    );
}; 
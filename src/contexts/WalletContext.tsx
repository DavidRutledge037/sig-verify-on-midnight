import React, { createContext, useContext } from 'react';

interface Transaction {
    id: string;
    status: string;
    hash?: string;
    type?: string;
}

interface WalletContextType {
    transactions: Transaction[];
    addTransaction: (tx: Transaction) => void;
    connect: () => void;
    disconnect: () => void;
    address: string | null;
    isConnected: boolean;
    chainId: number | null;
    switchNetwork: (chainId: number) => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode; value: WalletContextType }> = ({ children, value }) => {
    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}; 
import React, { createContext, useContext, useState } from 'react';
import { LaceWallet } from '../services/wallet/laceWallet';

interface Transaction {
    id: string;
    status: string;
    hash?: string;
    type?: string;
}

interface WalletContextType {
    transactions: Transaction[];
    addTransaction: (tx: Transaction) => void;
    connect: () => Promise<void>;
    disconnect: () => void;
    address: string | null;
    isConnected: boolean;
    chainId: number | null;
    switchNetwork: (chainId: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const wallet = new LaceWallet();

    const connect = async () => {
        try {
            const connected = await wallet.connect();
            if (connected) {
                const addr = await wallet.getAddress();
                setAddress(addr);
                setIsConnected(true);
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const disconnect = () => {
        setIsConnected(false);
        setAddress(null);
    };

    return (
        <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

// Add Lace to wallet options
const walletProviders = {
  lace: new LaceWallet(),
  // ... other wallets
}; 
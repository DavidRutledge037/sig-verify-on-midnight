import React, { createContext, useContext, useState } from 'react';
import { LaceWallet } from '../services/wallet/laceWallet';
import { MockWallet } from '../services/wallet/mockWallet';
import { WalletProvider as IWalletProvider } from '../types/wallet';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Use Lace wallet in production, MockWallet in development
const walletInstance: IWalletProvider = import.meta.env.PROD 
    ? new LaceWallet()
    : new MockWallet();

export const WalletContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    const connect = async () => {
        try {
            console.log('WalletContext: Attempting to connect...');
            const connected = await walletInstance.connect();
            if (connected) {
                const addr = await walletInstance.getAddress();
                console.log('WalletContext: Got address:', addr);
                setAddress(addr);
                setIsConnected(true);
            }
        } catch (error) {
            console.error('WalletContext: Failed to connect wallet:', error);
            throw error;
        }
    };

    const disconnect = () => {
        console.log('WalletContext: Disconnecting...');
        walletInstance.disconnect();
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
        throw new Error('useWallet must be used within a WalletContextProvider');
    }
    return context;
}; 
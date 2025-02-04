import React, { createContext, useContext, useState } from 'react';
import { MockWallet } from '../services/wallet/mockWallet';
import { WalletProvider as IWalletProvider } from '../types/wallet';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Create a single instance of MockWallet
const mockWallet = new MockWallet();

export const WalletContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    const connect = async () => {
        try {
            console.log('WalletContext: Attempting to connect...');
            const connected = await mockWallet.connect();
            if (connected) {
                const addr = await mockWallet.getAddress();
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
        mockWallet.disconnect();
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
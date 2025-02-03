import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { MidnightSDK } from '../types/sdk.js';
import type { WalletInfo } from '../types/wallet.js';

interface Transaction {
    hash: string;
    type: string;
    status: string;
    timestamp: Date;
}

interface WalletContextType {
    wallet: WalletInfo | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    sdk: MidnightSDK | null;
    transactions: Transaction[];
    addTransaction: (tx: Transaction) => void;
    updateTransactionStatus: (hash: string, status: string) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [wallet, setWallet] = useState<WalletInfo | null>(null);
    const [sdk, setSdk] = useState<MidnightSDK | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const connect = useCallback(async () => {
        if (typeof window.midnight === 'undefined') {
            throw new Error('Wallet not installed');
        }
        await window.midnight.connect();
        const address = await window.midnight.getAddress();
        const publicKey = await window.midnight.getPublicKey();
        const network = await window.midnight.getNetwork();
        const isConnected = await window.midnight.isConnected();

        setWallet({ 
            address,
            publicKey,
            network,
            isConnected
        });
    }, []);

    const disconnect = useCallback(() => {
        window.midnight?.disconnect();
        setWallet(null);
        setSdk(null);
    }, []);

    const addTransaction = (tx: Transaction) => {
        setTransactions(prev => [tx, ...prev]);
    };

    const updateTransactionStatus = (hash: string, status: string) => {
        setTransactions(prev =>
            prev.map(tx =>
                tx.hash === hash ? { ...tx, status } : tx
            )
        );
    };

    return (
        <WalletContext.Provider value={{ wallet, connect, disconnect, sdk, transactions, addTransaction, updateTransactionStatus }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
} 
import React from 'react';
import { useWallet } from '../contexts/WalletContext.js';

export function WalletConnect() {
    const { wallet, connect, disconnect } = useWallet();

    return (
        <div className="wallet-connect">
            {!wallet ? (
                <button onClick={connect}>Connect Wallet</button>
            ) : (
                <button onClick={disconnect}>Disconnect</button>
            )}
        </div>
    );
} 
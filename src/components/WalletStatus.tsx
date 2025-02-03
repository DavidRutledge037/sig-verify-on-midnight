import React from 'react';
import { useWallet } from '../contexts/WalletContext.js';
import { NetworkSelector } from './NetworkSelector.js';
import { WalletTransactions } from './WalletTransactions.js';

export function WalletStatus() {
    const { wallet, error, clearError, isLoading } = useWallet();

    if (isLoading) {
        return <div className="wallet-status loading">Connecting...</div>;
    }

    if (error) {
        return (
            <div className="wallet-status error">
                <p className="error-message">
                    {error === 'NOT_INSTALLED' && 'Please install Midnight wallet'}
                    {error === 'NOT_CONNECTED' && 'Please connect your wallet'}
                    {error === 'WRONG_NETWORK' && 'Please switch to the correct network'}
                    {error === 'REJECTED' && 'Transaction rejected'}
                    {error === 'FAILED' && 'Operation failed'}
                </p>
                <button onClick={clearError}>Dismiss</button>
            </div>
        );
    }

    if (!wallet) {
        return null;
    }

    return (
        <div className="wallet-status">
            <div className="wallet-header">
                <div className="wallet-info">
                    <span className="address">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </span>
                    {wallet.balance && (
                        <span className="balance">{wallet.balance}</span>
                    )}
                </div>
                <NetworkSelector />
            </div>
            <WalletTransactions />
        </div>
    );
} 
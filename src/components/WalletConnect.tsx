import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

export const WalletConnect: React.FC = () => {
    const { connect, disconnect, address, isConnected } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await connect();
        } catch (err) {
            setError('Failed to connect wallet');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wallet-connect">
            {!isConnected ? (
                <button 
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="connect-button"
                >
                    {isLoading ? 'Connecting...' : 'Connect Lace Wallet'}
                </button>
            ) : (
                <div className="wallet-info">
                    <span className="address">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
                    <button onClick={disconnect} className="disconnect-button">
                        Disconnect
                    </button>
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}; 
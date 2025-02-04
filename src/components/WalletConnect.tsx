import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { LoadingSpinner } from './LoadingSpinner';

export const WalletConnect: React.FC = () => {
    const { connect, disconnect, address, isConnected } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        try {
            console.log('WalletConnect: Starting connection process...');
            setIsLoading(true);
            setError(null);
            
            await connect();
            console.log('WalletConnect: Connection successful');
            
        } catch (err) {
            console.error('WalletConnect: Connection failed:', err);
            setError('Failed to connect wallet. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wallet-connect">
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}
            
            {!isConnected ? (
                <button 
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="connect-button"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span>Connecting...</span>
                        </>
                    ) : (
                        'Connect Mock Wallet'
                    )}
                </button>
            ) : (
                <div className="wallet-info">
                    <span className="address">
                        {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'No address'}
                    </span>
                    <button onClick={disconnect} className="disconnect-button">
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
}; 
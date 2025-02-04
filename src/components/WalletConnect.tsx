import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { LoadingSpinner } from './LoadingSpinner';

export const WalletConnect: React.FC = () => {
    const { connect, disconnect, address, isConnected } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLaceAvailable, setIsLaceAvailable] = useState<boolean>(false);

    useEffect(() => {
        // Check for Lace wallet on component mount
        const checkLaceWallet = () => {
            const hasLace = !!window.cardano?.lace;
            setIsLaceAvailable(hasLace);
            console.log('Lace wallet available:', hasLace);
        };

        checkLaceWallet();
        // Check again if window.cardano changes
        window.addEventListener('cardano', checkLaceWallet);
        return () => window.removeEventListener('cardano', checkLaceWallet);
    }, []);

    const handleConnect = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!isLaceAvailable) {
                throw new Error('Lace wallet not installed');
            }

            await connect();
        } catch (err) {
            console.error('Connection failed:', err);
            if (err instanceof Error) {
                if (err.message === 'Lace wallet not installed') {
                    setError('Please install Lace wallet to continue');
                } else {
                    setError('Failed to connect. Please try again.');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wallet-connect">
            {error && (
                <div className="error-message">
                    {error}
                    {error.includes('install') && (
                        <a 
                            href="https://www.lace.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="install-link"
                        >
                            Install Lace
                        </a>
                    )}
                    <button onClick={() => setError(null)} className="error-dismiss">✕</button>
                </div>
            )}
            
            {!isConnected ? (
                <button 
                    onClick={handleConnect}
                    disabled={isLoading || !isLaceAvailable}
                    className="connect-button"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span>Connecting...</span>
                        </>
                    ) : (
                        'Connect Lace Wallet'
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

            {!isLaceAvailable && !error && (
                <div className="wallet-warning">
                    <p>
                        Lace wallet not detected. 
                        <a 
                            href="https://www.lace.io"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Install Lace
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}; 
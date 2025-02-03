import React, { useState } from 'react';
import { WalletService } from '../services/WalletService';
import { AuthenticationService } from '../services/AuthenticationService';

interface Props {
    onLogin: (credentials: any) => void;
}

export const SecureLogin: React.FC<Props> = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLaceConnect = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Connect to Lace wallet
            const walletService = new WalletService(sdk);
            const walletInfo = await walletService.connectLaceWallet();
            
            // Authenticate with Midnight
            const authService = new AuthenticationService(sdk);
            const credentials = await authService.login(walletInfo.address);
            
            onLogin(credentials);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="secure-login">
            <h2>Connect with Lace Wallet</h2>
            <button 
                onClick={handleLaceConnect}
                disabled={loading}
                className="lace-connect-button"
            >
                {loading ? 'Connecting...' : 'Connect Lace Wallet'}
            </button>
            {error && <div className="error">{error}</div>}
        </div>
    );
}; 
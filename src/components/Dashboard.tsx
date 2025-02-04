import React from 'react';
import { useWallet } from '../contexts/WalletContext';

export const Dashboard: React.FC = () => {
    const { address } = useWallet();

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="dashboard-content">
                <div className="wallet-section">
                    <h3>Wallet Details</h3>
                    <p>Connected Address: {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'Not Connected'}</p>
                </div>
                
                <div className="stats-section">
                    <h3>Activity</h3>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">Documents Signed</span>
                            <span className="stat-value">0</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Verifications</span>
                            <span className="stat-value">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 
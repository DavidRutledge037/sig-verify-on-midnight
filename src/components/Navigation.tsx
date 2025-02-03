import React from 'react';
import { Link } from 'react-router-dom';
import { WalletConnect } from './WalletConnect.js';
import { WalletStatus } from './WalletStatus.js';
import { useWallet } from '../contexts/WalletContext.js';

export function Navigation() {
    const { wallet } = useWallet();

    return (
        <nav className="navigation">
            <div className="nav-brand">
                <Link to="/">Document Signer</Link>
            </div>
            <div className="nav-links">
                {wallet?.isConnected && (
                    <>
                        <Link to="/upload">Upload Document</Link>
                        <Link to="/sign">Sign Document</Link>
                    </>
                )}
            </div>
            <div className="nav-wallet">
                <WalletConnect />
                <WalletStatus />
            </div>
        </nav>
    );
} 
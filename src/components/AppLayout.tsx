import React from 'react';
import { WalletConnect } from './WalletConnect';
import { KYCFlow } from './KYCFlow';
import { useWallet } from '../contexts/WalletContext';
import { DocumentSigning } from './DocumentSigning';

export const AppLayout: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SigVerify on Midnight</h1>
        <WalletConnect />
      </header>

      <main className="app-main">
        {isConnected ? (
          <div className="content-container">
            <KYCFlow />
            <DocumentSigning />
          </div>
        ) : (
          <div className="connect-prompt">
            <p>Please connect your Lace wallet to get started</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Midnight Network</p>
      </footer>
    </div>
  );
}; 
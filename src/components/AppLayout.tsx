import React, { useState } from 'react';
import { WalletConnect } from './WalletConnect';
import { Dashboard } from './Dashboard';
import { DocumentSigning } from './DocumentSigning';
import { TransactionHistory } from './TransactionHistory';
import { useWallet } from '../contexts/WalletContext';

type Page = 'dashboard' | 'sign' | 'history';

export const AppLayout: React.FC = () => {
  const { isConnected } = useWallet();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'sign':
        return <DocumentSigning />;
      case 'history':
        return <TransactionHistory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SigVerify on Midnight</h1>
        <WalletConnect />
      </header>

      <main className="app-main">
        {isConnected ? (
          <>
            <nav className="app-nav">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage('sign')}
                className={`nav-button ${currentPage === 'sign' ? 'active' : ''}`}
              >
                Sign Document
              </button>
              <button 
                onClick={() => setCurrentPage('history')}
                className={`nav-button ${currentPage === 'history' ? 'active' : ''}`}
              >
                Transaction History
              </button>
            </nav>
            <div className="content-container">
              {renderPage()}
            </div>
          </>
        ) : (
          <div className="connect-prompt">
            <p>Please connect your wallet to get started</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Midnight Network</p>
      </footer>
    </div>
  );
}; 
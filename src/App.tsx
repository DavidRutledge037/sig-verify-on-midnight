import React from 'react';
import { WalletProvider } from './contexts/WalletContext';
import { AppLayout } from './components/AppLayout';
import './styles/app.css';

const App: React.FC = () => {
  return (
    <WalletProvider>
      <AppLayout />
    </WalletProvider>
  );
};

export default App; 
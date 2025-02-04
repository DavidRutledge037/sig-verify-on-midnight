import React from 'react';
import { WalletContextProvider } from './contexts/WalletContext';
import { AppLayout } from './components/AppLayout';
import './styles/app.css';

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <AppLayout />
    </WalletContextProvider>
  );
};

export default App; 
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MidnightLaceWallet } from '@/lib/wallet/midnight-lace';

const STORAGE_KEY = 'walletState';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  did: string | null;
  kycVerified: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  setDid: (did: string) => void;
  setKycVerified: (verified: boolean) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [did, setDid] = useState<string | null>(null);
  const [kycVerified, setKycVerified] = useState(false);

  useEffect(() => {
    const loadSavedState = async () => {
      try {
        // Get saved state
        const savedState = localStorage.getItem(STORAGE_KEY);
        console.log('Found saved state:', savedState);
        
        if (savedState) {
          const state = JSON.parse(savedState);
          setAddress(state.address);
          setDid(state.did);
          setKycVerified(state.kycVerified);
        }

        // Check wallet connection
        console.log('Checking wallet connection');
        const wallet = MidnightLaceWallet.getInstance();
        const isConnected = await wallet.isConnected();
        
        if (isConnected) {
          // If wallet is connected, try to restore session
          console.log('Wallet is connected, restoring session...');
          const connected = await wallet.connect();
          if (connected) {
            const address = await wallet.getAddress();
            setAddress(address);

            // Try to get DID if available
            try {
              const did = await wallet.getDID();
              if (did) {
                setDid(did);
                setKycVerified(true);
              }
            } catch (err) {
              console.log('No DID found for connected wallet');
            }
          }
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    };

    loadSavedState();
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    const state = {
      address,
      did,
      kycVerified,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [address, did, kycVerified]);

  const connect = async () => {
    try {
      const wallet = MidnightLaceWallet.getInstance();
      console.log('Attempting to connect wallet...');
      
      const connected = await wallet.connect();
      console.log('Wallet connect result:', connected);
      
      if (connected) {
        const address = await wallet.getAddress();
        setAddress(address);
        setIsConnected(true);

        try {
          const did = await wallet.getDID();
          if (did) {
            setDid(did);
            setKycVerified(true);
          }
        } catch (err) {
          console.log('No DID found for connected wallet');
        }
      } else {
        setIsConnected(false);
      }

      return connected;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsConnected(false);
      return false;
    }
  };

  const disconnect = () => {
    const wallet = MidnightLaceWallet.getInstance();
    wallet.disconnect();
    setAddress(null);
    setDid(null);
    setKycVerified(false);
    setIsConnected(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    isConnected,
    address,
    did,
    kycVerified,
    connect,
    disconnect,
    setDid,
    setKycVerified
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

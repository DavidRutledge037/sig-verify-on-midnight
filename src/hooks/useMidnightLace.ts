import { useCallback, useEffect, useState } from 'react';
import { MidnightLaceWallet } from '../lib/wallet/midnight-lace';

export function useMidnightLace() {
  const [wallet, setWallet] = useState<MidnightLaceWallet | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get wallet instance
    const instance = MidnightLaceWallet.getInstance();
    setWallet(instance);
  }, []);

  const connect = useCallback(async () => {
    if (!wallet) {
      setError('Wallet not initialized');
      return false;
    }

    try {
      setError(null);
      const success = await wallet.connect();
      setConnected(success);
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setConnected(false);
      return false;
    }
  }, [wallet]);

  const disconnect = useCallback(async () => {
    if (!wallet) {
      return;
    }

    try {
      await wallet.disconnect();
      setConnected(false);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  }, [wallet]);

  return {
    wallet,
    connected,
    error,
    connect,
    disconnect
  };
}

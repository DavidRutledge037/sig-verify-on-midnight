import { useEffect, useState } from 'react';
import { MidnightLaceWallet } from './midnight-lace';

export function useMidnightLaceWallet() {
  const [wallet, setWallet] = useState<MidnightLaceWallet | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      const instance = MidnightLaceWallet.getInstance();
      setWallet(instance);
    }
  }, []);

  return wallet;
}

export default useMidnightLaceWallet;

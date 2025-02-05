import { createContext } from 'react';

export const WalletContext = createContext({
    isConnected: false,
    connect: async () => {},
    disconnect: async () => {},
    getAddress: async () => null as string | null,
    signMessage: async (message: string) => null as string | null,
}); 
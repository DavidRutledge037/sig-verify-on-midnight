import { WalletProvider } from '../../types/wallet';

export class LaceWallet implements WalletProvider {
    private isConnected = false;

    async connect(): Promise<boolean> {
        console.log('LaceWallet: Attempting to connect...');
        
        if (!window.cardano?.lace) {
            console.error('LaceWallet: Lace wallet not found');
            throw new Error('Lace wallet not installed');
        }

        try {
            // Connect to Lace wallet
            await window.cardano.lace.enable();
            this.isConnected = true;
            console.log('LaceWallet: Connected successfully');
            return true;
        } catch (error) {
            console.error('LaceWallet: Connection failed:', error);
            throw error;
        }
    }

    async getAddress(): Promise<string | null> {
        if (!this.isConnected || !window.cardano?.lace) {
            return null;
        }

        try {
            const addresses = await window.cardano.lace.getUsedAddresses();
            return addresses[0] || null;
        } catch (error) {
            console.error('LaceWallet: Failed to get address:', error);
            return null;
        }
    }

    async disconnect(): Promise<void> {
        this.isConnected = false;
        console.log('LaceWallet: Disconnected');
    }
} 
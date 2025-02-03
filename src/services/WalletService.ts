import { MidnightSDK } from '../sdk/midnight';

export interface WalletInfo {
    address: string;
    network: string;
    balance: string;
    isConnected: boolean;
}

export class WalletService {
    private static LACE_WALLET_ID = 'lace';
    private walletInfo: WalletInfo | null = null;

    constructor(private sdk: MidnightSDK) {}

    async connectLaceWallet(): Promise<WalletInfo> {
        try {
            // Check if Lace wallet is available
            if (!(window as any).cardano?.lace) {
                throw new Error('Please install Lace wallet');
            }

            // Request wallet connection
            const wallet = (window as any).cardano.lace;
            await wallet.enable();

            // Get wallet info
            const address = await wallet.getAddress();
            const network = await wallet.getNetwork();
            const balance = await wallet.getBalance();

            this.walletInfo = {
                address,
                network,
                balance: balance.toString(),
                isConnected: true
            };

            return this.walletInfo;
        } catch (error) {
            throw new Error(`Failed to connect Lace wallet: ${error}`);
        }
    }

    async signTransaction(transaction: any): Promise<string> {
        if (!this.walletInfo?.isConnected) {
            throw new Error('Wallet not connected');
        }

        const wallet = (window as any).cardano.lace;
        return await wallet.signTransaction(transaction);
    }

    async getWalletInfo(): Promise<WalletInfo | null> {
        return this.walletInfo;
    }
} 
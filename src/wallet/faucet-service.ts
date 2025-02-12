import axios from 'axios';
import { MidnightWallet } from './midnight-wallet';

export class FaucetService {
    private readonly FAUCET_URL = 'https://faucet.testnet.midnight.network';
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_DELAY = 5000; // 5 seconds

    constructor(private wallet: MidnightWallet) {}

    async requestTokens(): Promise<boolean> {
        try {
            const address = await this.wallet.getAddress();
            const initialBalance = await this.wallet.getBalance();
            console.log(`Initial balance: ${initialBalance} umid`);

            // Request tokens from faucet
            const response = await axios.post(this.FAUCET_URL, {
                address,
                denom: 'umid'
            });

            if (response.status === 200) {
                console.log('Faucet request successful');
                console.log('Transaction hash:', response.data.txhash);

                // Wait for transaction to be processed
                await this.waitForBalance(address, initialBalance);
                return true;
            }

            return false;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Faucet request failed:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            throw error;
        }
    }

    private async waitForBalance(address: string, initialBalance: string): Promise<void> {
        for (let i = 0; i < this.MAX_RETRIES; i++) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
            
            const newBalance = await this.wallet.getBalance();
            if (newBalance !== initialBalance) {
                console.log(`New balance: ${newBalance} umid`);
                return;
            }
            console.log('Waiting for balance update...');
        }
        throw new Error('Balance update timeout');
    }
} 
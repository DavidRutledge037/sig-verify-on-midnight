import axios from 'axios';
import { WalletService } from '../services/wallet.service';
import env from '../config/env';

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function requestTokens() {
    const GREEN = '\x1b[32m';
    const YELLOW = '\x1b[33m';
    const RED = '\x1b[31m';
    const RESET = '\x1b[0m';

    try {
        console.log('🚰 Initializing wallet and requesting tokens...\n');

        // Initialize wallet
        const walletService = new WalletService();
        await walletService.initialize();
        const address = await walletService.getAddress();
        console.log(`Wallet Address: ${YELLOW}${address}${RESET}`);
        
        // Request tokens from faucet with updated payload format
        console.log(`\nRequesting tokens from: ${env.FAUCET_URL}`);
        const response = await axios.post(env.FAUCET_URL + '/request', {
            wallet: address
        });

        if (response.data.success) {
            console.log(`\n${GREEN}✅ Faucet request successful!${RESET}`);
            console.log('\nWaiting for tokens to arrive...');

            // Check balance with retry
            for (let i = 0; i < 10; i++) {
                await sleep(3000); // Wait 3 seconds between checks
                const balance = await walletService.getBalance();
                console.log(`Current balance: ${YELLOW}${balance}${RESET} umid`);
                
                if (Number(balance) > 0) {
                    console.log(`\n${GREEN}✅ Tokens received successfully!${RESET}`);
                    return;
                }
            }
            
            console.log(`\n${YELLOW}⚠️  Tokens may take a few minutes to arrive. Check your balance later.${RESET}`);
        } else {
            throw new Error('Faucet request failed');
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`${RED}❌ Faucet request failed:${RESET}`, error.response?.data || error.message);
            if (error.response?.status === 429) {
                console.log(`${YELLOW}The faucet has rate limits. Please try again in a few minutes.${RESET}`);
            }
        } else {
            console.error(`${RED}❌ Error:${RESET}`, error);
        }
        process.exit(1);
    }
}

requestTokens().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 
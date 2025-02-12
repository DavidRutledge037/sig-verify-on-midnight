import { WalletService } from '../services/wallet.service';
import env from '../config/env';

async function faucetHelper() {
    try {
        console.log('🚰 Midnight Devnet Faucet Helper\n');

        // Initialize wallet and get address
        const wallet = new WalletService();
        await wallet.initialize();
        const address = await wallet.getAddress();

        // Show instructions
        console.log('\n📝 Instructions:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('1. Visit the faucet page:');
        console.log(`   ${env.FAUCET_URL}`);
        console.log('2. Copy and paste this wallet address:');
        console.log(`   ${address}`);
        console.log('3. Request tDUST tokens');
        console.log('4. Wait for tokens to arrive\n');

        // Start balance monitoring
        console.log('📊 Monitoring balance for incoming tokens...\n');
        let lastBalance = '0';
        setInterval(async () => {
            const balance = await wallet.getBalance();
            if (balance.amount !== lastBalance) {
                console.log(`💫 Tokens received! New balance: ${balance.amount} ${balance.denom.toUpperCase()}`);
                lastBalance = balance.amount;
            }
        }, 5000);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

faucetHelper(); 
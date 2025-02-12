import { WalletService } from '../services/wallet.service';

async function checkBalance() {
    try {
        const wallet = new WalletService();
        await wallet.initialize();
        
        // Display initial balance
        await wallet.displayBalance();
        
        // Monitor balance changes every 10 seconds
        console.log('📊 Monitoring balance changes (Ctrl+C to stop)...\n');
        
        let lastBalance = '0';
        setInterval(async () => {
            const balance = await wallet.getBalance();
            if (balance.amount !== lastBalance) {
                console.log(`💫 Balance updated: ${balance.amount} ${balance.denom.toUpperCase()}`);
                lastBalance = balance.amount;
            }
        }, 10000);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkBalance(); 
import { MidnightWallet } from '../wallet/midnight-wallet';
import { FaucetService } from '../wallet/faucet-service';
import * as dotenv from 'dotenv';

dotenv.config();

async function testFaucet() {
    const config = {
        nodeUrl: process.env.MIDNIGHT_NODE_URL || 'https://rpc.testnet.midnight.network',
        chainId: process.env.MIDNIGHT_CHAIN_ID || 'midnight-testnet',
        prefix: 'midnight',
        mnemonic: process.env.MIDNIGHT_MNEMONIC
    };

    if (!config.mnemonic) {
        throw new Error('No mnemonic found in .env file. Run create-wallet.ts first.');
    }

    try {
        // Initialize wallet
        const wallet = new MidnightWallet(config);
        await wallet.initialize();

        // Initialize faucet service
        const faucet = new FaucetService(wallet);

        // Request tokens
        console.log('Requesting tokens from faucet...');
        await faucet.requestTokens();

    } catch (error) {
        console.error('Error testing faucet:', error);
    }
}

testFaucet(); 
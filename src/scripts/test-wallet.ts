import { MidnightWallet } from '../wallet/midnight-wallet';
import * as dotenv from 'dotenv';

dotenv.config();

async function testWallet() {
    const config = {
        nodeUrl: process.env.MIDNIGHT_NODE_URL || 'https://rpc.testnet.midnight.network',
        chainId: process.env.MIDNIGHT_CHAIN_ID || 'midnight-testnet',
        prefix: 'midnight',
        mnemonic: process.env.MIDNIGHT_MNEMONIC
    };

    try {
        const wallet = new MidnightWallet(config);
        await wallet.initialize();

        const address = await wallet.getAddress();
        console.log('Wallet address:', address);

        const balance = await wallet.getBalance();
        console.log('Current balance:', balance, 'umid');

        if (!config.mnemonic) {
            const mnemonic = await wallet.getMnemonic();
            console.log('\nNew wallet mnemonic (SAVE THIS):', mnemonic);
        }

    } catch (error) {
        console.error('Error testing wallet:', error);
    }
}

testWallet(); 
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as fs from 'fs';
import * as path from 'path';

async function setupWallet() {
    const GREEN = '\x1b[32m';
    const YELLOW = '\x1b[33m';
    const RESET = '\x1b[0m';

    try {
        console.log('🔐 Setting up Midnight Wallet...\n');

        // Generate new wallet
        const wallet = await DirectSecp256k1HdWallet.generate(24, {
            prefix: 'midnight'
        });
        const [account] = await wallet.getAccounts();
        const mnemonic = await wallet.mnemonic;

        // Update .env file
        const envPath = path.join(process.cwd(), '.env');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        // Add or update MIDNIGHT_MNEMONIC
        if (envContent.includes('MIDNIGHT_MNEMONIC=')) {
            envContent = envContent.replace(
                /MIDNIGHT_MNEMONIC=.*/,
                `MIDNIGHT_MNEMONIC="${mnemonic}"`
            );
        } else {
            envContent += `\nMIDNIGHT_MNEMONIC="${mnemonic}"`;
        }

        fs.writeFileSync(envPath, envContent.trim() + '\n');

        console.log(`${GREEN}✅ Wallet created successfully!${RESET}\n`);
        console.log('📝 Wallet Details:');
        console.log(`Address: ${YELLOW}${account.address}${RESET}`);
        console.log(`\n${YELLOW}⚠️  IMPORTANT: Save this mnemonic securely!${RESET}`);
        console.log(`Mnemonic: ${YELLOW}${mnemonic}${RESET}\n`);
        console.log('The mnemonic has been saved to your .env file.');

    } catch (error) {
        console.error('❌ Failed to setup wallet:', error);
        process.exit(1);
    }
}

setupWallet(); 
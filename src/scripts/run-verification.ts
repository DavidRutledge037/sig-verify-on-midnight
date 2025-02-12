import { execSync } from 'child_process';
import { DatabaseClient } from '../database/client';
import { WalletService } from '../services/wallet.service';
import { KYCRepository } from '../database/repositories/kyc.repository';
import env from '../config/env';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function runVerification() {
    console.log(`${BLUE}🚀 Starting System Verification${RESET}\n`);

    let dbClient: DatabaseClient | null = null;
    let walletService: WalletService | null = null;

    try {
        // 1. Environment Check
        console.log(`${BLUE}Checking Environment Variables...${RESET}`);
        const requiredVars = {
            'MONGODB_URI': env.MONGODB_URI,
            'DATABASE_NAME': env.DATABASE_NAME,
            'MIDNIGHT_NODE_URL': env.MIDNIGHT_NODE_URL,
            'MIDNIGHT_MNEMONIC': env.MIDNIGHT_MNEMONIC
        };

        for (const [key, value] of Object.entries(requiredVars)) {
            console.log(`${key}: ${value ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`}`);
            if (!value) throw new Error(`Missing required environment variable: ${key}`);
        }

        // 2. Database Connection
        console.log(`\n${BLUE}Testing Database Connection...${RESET}`);
        dbClient = new DatabaseClient(env.MONGODB_URI, env.DATABASE_NAME);
        await dbClient.connect();
        console.log(`${GREEN}✓ Database connected successfully${RESET}`);

        // 3. Wallet Initialization
        console.log(`\n${BLUE}Testing Wallet Service...${RESET}`);
        walletService = new WalletService();
        await walletService.initialize();
        const address = await walletService.getAddress();
        const balance = await walletService.getBalance();
        console.log(`${GREEN}✓ Wallet initialized${RESET}`);
        console.log(`Address: ${YELLOW}${address}${RESET}`);
        console.log(`Balance: ${YELLOW}${balance}${RESET} umid`);

        // 4. KYC Repository
        console.log(`\n${BLUE}Testing KYC Repository...${RESET}`);
        const kycRepo = new KYCRepository(dbClient, 'kyc');
        const testDoc = await kycRepo.create({
            userId: address,
            verificationLevel: 'basic',
            status: 'pending',
            proofHash: '',
            documents: []
        });
        console.log(`${GREEN}✓ KYC repository working${RESET}`);
        console.log('Created document ID:', testDoc._id?.toString());

        // 5. Message Signing
        console.log(`\n${BLUE}Testing Message Signing...${RESET}`);
        const message = 'Test message for verification';
        const signature = await walletService.signMessage(message);
        console.log(`${GREEN}✓ Message signed successfully${RESET}`);
        console.log(`Signature: ${YELLOW}${signature}${RESET}`);

        // 6. Update KYC Status
        console.log(`\n${BLUE}Testing KYC Status Update...${RESET}`);
        const updated = await kycRepo.updateStatus(
            testDoc._id!.toString(),
            'verified',
            signature
        );
        console.log(`${GREEN}✓ KYC status updated successfully${RESET}`);
        console.log('Updated status:', updated?.status);

        console.log(`\n${GREEN}✅ All verifications passed successfully!${RESET}`);

    } catch (error) {
        console.error(`\n${RED}❌ Verification failed:${RESET}`, error);
        process.exit(1);
    } finally {
        // Cleanup
        if (dbClient) {
            console.log(`\n${BLUE}Cleaning up...${RESET}`);
            await dbClient.disconnect();
            console.log(`${GREEN}✓ Database disconnected${RESET}`);
        }
    }
}

runVerification().catch(error => {
    console.error(`${RED}Fatal error:${RESET}`, error);
    process.exit(1);
}); 
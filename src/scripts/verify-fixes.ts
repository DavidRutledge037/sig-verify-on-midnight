import { execSync } from 'child_process';
import { DatabaseClient } from '../database/client';
import { WalletService } from '../services/wallet.service';
import { KYCRepository } from '../database/repositories/kyc.repository';
import env from '../config/env';

async function verifyFixes() {
    console.log('\n🔍 Starting verification...');

    try {
        // 1. Verify Database Connection
        console.log('\n📦 Testing Database Connection...');
        const dbClient = new DatabaseClient(env.MONGODB_URI, env.DATABASE_NAME);
        await dbClient.connect();
        console.log('✅ Database connection successful');

        // 2. Verify Wallet Service
        console.log('\n💳 Testing Wallet Service...');
        const walletService = new WalletService();
        await walletService.initialize();
        const address = await walletService.getAddress();
        console.log('✅ Wallet initialized successfully');
        console.log(`📍 Wallet Address: ${address}`);

        // 3. Verify KYC Repository
        console.log('\n📋 Testing KYC Repository...');
        const kycRepo = new KYCRepository(dbClient, 'kyc');
        const testDoc = await kycRepo.create({
            userId: address,
            verificationLevel: 'basic',
            status: 'pending',
            proofHash: '',
            documents: []
        });
        console.log('✅ KYC Repository working correctly');

        // 4. Run Test Suite
        console.log('\n🧪 Running Test Suite...');
        execSync('npm run test', { stdio: 'inherit' });

        // 5. Generate Coverage Report
        console.log('\n📊 Generating Coverage Report...');
        execSync('npm run test:coverage', { stdio: 'inherit' });

        // Cleanup
        await dbClient.disconnect();
        console.log('\n✨ All verifications completed successfully!');

    } catch (error) {
        console.error('\n❌ Verification failed:', error);
        process.exit(1);
    }
}

// Run verification
verifyFixes(); 
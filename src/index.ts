import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MidnightSDK } from './sdk/midnight.js';
import { config } from './config/environment.js';
import { DIDManager } from './contracts/DIDManager.js';
import { PrivateKYCManager } from './contracts/PrivateKYCManager.js';
import { VerificationLevel } from './types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let isShuttingDown = false;

async function main() {
    console.log('🔄 Starting application...');
    
    try {
        if (isShuttingDown) return;
        
        console.log('🚀 Initializing Midnight SDK...');
        const sdk = new MidnightSDK({
            nodeUrl: config.midnight.nodeUrl,
            chainId: config.midnight.chainId,
            privacyLevel: config.midnight.privacyLevel
        });
        
        console.log('📝 Creating DID Manager...');
        const didManager = new DIDManager(sdk);

        console.log('🔑 Creating KYC Manager...');
        const kycManager = new PrivateKYCManager(sdk);

        console.log('🏗️ Attempting to create DID...');
        const did = await didManager.createDID('test_address', 'test_public_key');
        console.log('✅ Created DID:', did);

        console.log('🔍 Testing KYC verification...');
        const proofs = new Map([
            ['identity', 'test_proof'],
            ['address', 'test_address_proof']
        ]);

        await kycManager.verifyIdentityWithPrivacy(
            did,
            VerificationLevel.BASIC,
            proofs,
            ['viewer1']
        );
        console.log('✅ KYC verification completed');
        
        console.log('🎉 All operations completed successfully!');
        
        // Clean exit
        if (!isShuttingDown) {
            process.exit(0);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    isShuttingDown = true;
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down gracefully...');
    isShuttingDown = true;
    process.exit(0);
});

// Start the application
main().catch(console.error); 
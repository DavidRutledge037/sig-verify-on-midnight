import { beforeAll, afterAll, afterEach } from 'vitest';
import { WalletService } from '../../services/wallet.service';
import { DatabaseClient } from '../../database/client';
import { KYCService } from '../../services/kyc.service';
import env from '../../config/env';

export interface TestContext {
    walletService: WalletService;
    dbClient: DatabaseClient;
    kycService: KYCService;
}

export async function setupE2E(): Promise<TestContext> {
    // Initialize services
    const walletService = new WalletService();
    await walletService.initialize();

    // Initialize database
    const dbClient = new DatabaseClient(
        env.TEST_MONGODB_URI || env.MONGODB_URI,
        'e2e_test_db'
    );
    await dbClient.connect();

    // Initialize KYC service
    const kycService = new KYCService(
        walletService,
        dbClient.getDb().collection('kyc')
    );

    return {
        walletService,
        dbClient,
        kycService
    };
} 
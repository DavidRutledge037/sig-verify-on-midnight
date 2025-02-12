import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { ProofService } from '../../src/services/proof';
import { MidnightService } from '../../src/services/midnight';
import { WalletService } from '../../src/services/wallet';
import { DatabaseService } from '../../src/services/database';

describe('Proof Flow E2E Tests', () => {
    let dbService: DatabaseService;
    let proofService: ProofService;
    let midnightService: MidnightService;
    let walletService: WalletService;

    beforeAll(async () => {
        // Initialize services
        dbService = new DatabaseService(process.env.MONGODB_URI || 'mongodb://localhost:27017', 'test-db');
        await dbService.connect();
        
        midnightService = new MidnightService(
            process.env.MIDNIGHT_URL || 'http://localhost:1234',
            process.env.CHAIN_ID || 'test-chain-1'
        );
        proofService = new ProofService(
            process.env.MIDNIGHT_URL || 'http://localhost:1234',
            process.env.CHAIN_ID || 'test-chain-1'
        );
        walletService = new WalletService();
    });

    afterAll(async () => {
        await dbService.disconnect();
    });

    it('should complete full proof lifecycle', async () => {
        // Create and sign proof
        const testData = { type: 'test', value: 'test-data' };
        const wallet = await walletService.createWallet();
        const signature = await walletService.sign(JSON.stringify(testData));
        
        const proof = {
            type: 'TestProof',
            created: new Date().toISOString(),
            creator: wallet.address,
            signatureValue: signature,
            data: testData
        };

        // Submit proof
        const txHash = await proofService.submitProof(proof);
        expect(txHash).toBeDefined();

        // Wait for transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Verify proof
        const isValid = await proofService.verifyProof(txHash);
        expect(isValid).toBe(true);

        // Get proof details
        const details = await midnightService.getTransactionDetails(txHash);
        expect(details).toBeDefined();
        expect(details.proof).toBeDefined();
    });

    // ... additional test cases ...
}); 
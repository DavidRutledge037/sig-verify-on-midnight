import { WalletService } from '../../services/wallet.service';
import { KYCService } from '../../services/kyc.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

// Create a mock class that extends WalletService
class MockWalletService extends WalletService {
    async initialize(): Promise<void> {
        return Promise.resolve();
    }

    async getAddress(): Promise<string> {
        return 'mock_address';
    }

    async signMessage(message: string): Promise<string> {
        return 'mock_signature';
    }

    async getClient(): Promise<any> {
        return {
            getChainId: () => Promise.resolve('mock-chain-1'),
            getBalance: () => Promise.resolve({ amount: '1000000', denom: 'tdust' })
        };
    }
}

describe('Wallet-KYC Integration', () => {
    let mongoServer: MongoMemoryServer;
    let mongoClient: MongoClient;
    let walletService: WalletService;
    let kycService: KYCService;

    beforeAll(async () => {
        // Setup in-memory MongoDB
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        mongoClient = await MongoClient.connect(mongoUri);

        // Setup services with mocked wallet
        walletService = new MockWalletService();
        await walletService.initialize();

        const db = mongoClient.db('test');
        const kycCollection = db.collection('kyc');
        const kycRepository = {
            collection: kycCollection,
            save: async (doc: any) => kycCollection.insertOne(doc),
            findByAddress: async (address: string) => kycCollection.findOne({ address })
        };
        kycService = new KYCService(walletService, kycRepository);
    });

    afterAll(async () => {
        await mongoClient.close();
        await mongoServer.stop();
    });

    it('should create KYC verification with wallet signature', async () => {
        const result = await kycService.submitKYC({
            documents: [{
                type: 'id',
                documentHash: 'test_hash'
            }]
        });

        expect(result).toBeDefined();
        expect(result.status).toBe('pending');
    });

    it('should update KYC status with signed proof', async () => {
        const status = await kycService.getKYCStatus('mock_address');
        expect(status).toBeDefined();
        expect(status?.status).toBe('pending');
    });
}); 
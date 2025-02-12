import { KYCService } from '../../services/kyc.service';
import { WalletService } from '../../services/wallet.service';
import { KYCDocument } from '../../types/kyc';

class MockWalletService extends WalletService {
    private shouldError = false;

    async initialize(): Promise<void> {
        return Promise.resolve();
    }

    async getAddress(): Promise<string> {
        if (this.shouldError) throw new Error('Mock error');
        return 'mock_address';
    }

    async signMessage(message: string): Promise<string> {
        if (this.shouldError) throw new Error('Mock error');
        return 'mock_signature';
    }

    simulateError(): void {
        this.shouldError = true;
    }
}

describe('KYC Service', () => {
    let kycService: KYCService;
    let mockWallet: MockWalletService;
    let kycRepository: any;

    beforeEach(() => {
        mockWallet = new MockWalletService();
        kycRepository = {
            save: jest.fn(),
            findByAddress: jest.fn(),
            collection: {
                findOne: jest.fn()
            }
        };
        kycService = new KYCService(mockWallet, kycRepository);
    });

    it('should submit KYC documents', async () => {
        const kycData = {
            documents: [{ type: 'id', documentHash: 'test_hash' }] as KYCDocument[]
        };

        await kycService.submitKYC(kycData);
        expect(kycRepository.save).toHaveBeenCalled();
    });

    it('should handle wallet errors gracefully', async () => {
        mockWallet.simulateError();
        const kycData = {
            documents: [{ type: 'id', documentHash: 'test_hash' }] as KYCDocument[]
        };

        await expect(kycService.submitKYC(kycData)).rejects.toThrow();
    });
}); 
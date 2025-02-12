import { WalletService } from './wallet.service';
import { KYCDocument, KYCSubmission, KYCStatus } from '../types/kyc';

export class KYCService {
    constructor(
        private walletService: WalletService,
        private kycRepository: any
    ) {}

    async submitKYC(submission: KYCSubmission): Promise<KYCStatus> {
        const address = await this.walletService.getAddress();
        
        // Create KYC status record
        const kycStatus: KYCStatus = {
            status: 'pending',
            address,
            documents: submission.documents,
            updatedAt: new Date()
        };

        // Save to repository
        await this.kycRepository.save(kycStatus);
        
        return kycStatus;
    }

    async getKYCStatus(address: string): Promise<KYCStatus | null> {
        return this.kycRepository.findByAddress(address);
    }
} 
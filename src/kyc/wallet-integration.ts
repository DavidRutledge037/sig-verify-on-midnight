import { MidnightService } from '../services/midnight';
import { KYCManager } from './manager';

export class KYCWalletIntegration {
    constructor(
        private midnightService: MidnightService,
        private kycManager: KYCManager
    ) {}

    async submitKYCVerification(
        did: string, 
        documents: Array<{ type: string, content: Buffer }>
    ): Promise<string> {
        // First submit KYC data to our database
        const kycResult = await this.kycManager.submitVerification(
            did,
            documents
        );

        // Create a DID-linked KYC proof on Midnight
        const txResult = await this.midnightService.submitDID({
            id: did,
            verificationMethod: [{
                id: `${did}#kyc`,
                type: 'KYCVerification',
                controller: did,
                publicKeyMultibase: kycResult.verification.proofHash
            }],
            authentication: [`${did}#kyc`]
        });

        return txResult.transactionHash;
    }

    async verifyKYCStatus(did: string): Promise<boolean> {
        const didDoc = await this.midnightService.queryDID(did);
        return didDoc.verificationMethod.some(
            (vm: any) => vm.type === 'KYCVerification'
        );
    }
} 
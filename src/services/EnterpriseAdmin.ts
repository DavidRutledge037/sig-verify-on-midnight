import { DIDManagement } from './DIDManagement';
import { KYCVerification } from './KYCVerification';

export class EnterpriseAdmin {
    constructor(
        private didManagement: DIDManagement,
        private kycVerification: KYCVerification
    ) {}

    async verifyAdmin(did: string): Promise<boolean> {
        try {
            // Validate DID format
            if (!did.startsWith('did:midnight:')) {
                throw new Error('Invalid DID format');
            }

            // Verify DID exists
            await this.didManagement.resolveDID(did);

            // Check admin status through KYC verification
            return this.kycVerification.verifyKYC({
                content: {
                    userId: did,
                    level: 'admin',
                    timestamp: Date.now()
                },
                signature: 'placeholder',
                signerDID: did
            });
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Admin verification failed');
        }
    }
} 
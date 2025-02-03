import { 
    Contract, 
    Address,
    VerificationLevel,
    PrivacyLevel,
    type PrivacyConfig,
    msg 
} from '../types/index.js';
import { KYCData, KYCStatus } from '../types/kyc.js';
import { MidnightSDK } from '../sdk/midnight.js';
import { createHash } from 'crypto';

export class PrivateKYCManager extends Contract {
    private sdk: MidnightSDK;
    private verifiedIdentities: Map<string, KYCData>;
    private verifiers: Set<Address>;

    constructor(sdk: MidnightSDK) {
        super();
        this.sdk = sdk;
        this.verifiedIdentities = new Map();
        this.verifiers = new Set();
    }

    async verifyIdentityWithPrivacy(
        did: string,
        level: VerificationLevel,
        proofs: Map<string, string>,
        allowedViewers: string[]
    ): Promise<void> {
        // Generate ZK proof for KYC verification
        const zkProof = await this.sdk.generateZKProof({
            did,
            level,
            proofs,
            allowedViewers
        });

        const kycData: KYCData = {
            userId: did,
            status: KYCStatus.VERIFIED,
            verificationLevel: level,
            timestamp: Date.now(),
            expiryDate: Date.now() + 365 * 24 * 60 * 60 * 1000,
            verifier: msg.sender,
            proofHash: this.generateProofHash(proofs)
        };

        // Submit as shielded transaction
        await this.sdk.submitShieldedTransaction(
            'verifyIdentity',
            [kycData, allowedViewers],
            zkProof
        );

        this.verifiedIdentities.set(did, kycData);
    }

    private generateProofHash(proofs: Map<string, string>): string {
        const proofStr = Array.from(proofs.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join('|');
        return createHash('sha256').update(proofStr).digest('hex');
    }
} 
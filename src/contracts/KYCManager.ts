import { Contract, Address } from '../types/index.js';
import { KYCData, KYCStatus, VerificationLevel, VerifiedIdentity } from '../types/kyc.js';
import { createHash } from 'crypto';
import { msg } from '../types/sdk.js';

export class KYCManager extends Contract {
    private verifiedIdentities: Map<string, VerifiedIdentity>;
    private kycData: Map<string, KYCData>;
    private verifiers: Set<Address>;

    constructor() {
        super();
        this.verifiedIdentities = new Map();
        this.kycData = new Map();
        this.verifiers = new Set();
    }

    public async verifyIdentity(
        did: string,
        verificationLevel: VerificationLevel,
        proofs: Map<string, string>
    ): Promise<void> {
        if (!this.verifiers.has(msg.sender)) {
            throw new Error('Not authorized verifier');
        }

        const kycData: KYCData = {
            userId: did,
            status: KYCStatus.VERIFIED,
            verificationLevel,
            timestamp: Date.now(),
            expiryDate: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
            verifier: msg.sender,
            proofHash: this.generateProofHash(proofs)
        };

        const identity: VerifiedIdentity = {
            did,
            kycVerified: true,
            kycData,
            zkProofs: proofs
        };

        this.verifiedIdentities.set(did, identity);
        this.kycData.set(did, kycData);
    }

    public async addVerifier(verifier: Address): Promise<void> {
        if (msg.sender !== this.owner) {
            throw new Error('Only owner can add verifiers');
        }
        this.verifiers.add(verifier);
    }

    public async getKYCStatus(did: string): Promise<KYCStatus> {
        const data = this.kycData.get(did);
        if (!data) {
            return KYCStatus.PENDING;
        }
        if (data.expiryDate < Date.now()) {
            return KYCStatus.EXPIRED;
        }
        return data.status;
    }

    private generateProofHash(proofs: Map<string, string>): string {
        const proofStr = Array.from(proofs.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join('|');
        return createHash('sha256').update(proofStr).digest('hex');
    }
} 
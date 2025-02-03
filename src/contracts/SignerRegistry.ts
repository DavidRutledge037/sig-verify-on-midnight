import { Contract, Address, msg, PrivacyLevel } from '../types/index.js';
import { MidnightSDK } from '../sdk/midnight.js';
import { DIDManager } from './DIDManager.js';
import { PrivateKYCManager } from './PrivateKYCManager.js';
import { createHash } from 'crypto';

export interface VerifiedSigner {
    did: string;
    kycStatus: 'verified' | 'pending' | 'rejected';
    kycLevel: string;
    kycTimestamp: number;
    signingKey: string;
    pseudonym: string;
    encryptedDetails: string;
}

export interface SignerProof {
    pseudonym: string;
    proofHash: string;
    timestamp: number;
    zkProof: string;
}

export class SignerRegistry extends Contract {
    private sdk: MidnightSDK;
    private didManager: DIDManager;
    private kycManager: PrivateKYCManager;
    private verifiedSigners: Map<string, VerifiedSigner>;
    private didToPseudonym: Map<string, string>;
    private pseudonymToDid: Map<string, string>;
    private signerProofs: Map<string, SignerProof[]>;

    constructor(
        sdk: MidnightSDK, 
        didManager: DIDManager,
        kycManager: PrivateKYCManager
    ) {
        super();
        this.sdk = sdk;
        this.didManager = didManager;
        this.kycManager = kycManager;
        this.verifiedSigners = new Map();
        this.didToPseudonym = new Map();
        this.pseudonymToDid = new Map();
        this.signerProofs = new Map();
    }

    async registerSigner(
        address: string,
        publicKey: string,
        kycProofs: Map<string, string>,
        encryptedDetails: string // Additional encrypted signer details
    ): Promise<string> {
        // Create DID with enhanced privacy
        const did = await this.didManager.createDID(address, publicKey);
        
        // Generate deterministic but private pseudonym
        const pseudonym = await this.generatePseudonym(did);

        // Create proof of signer registration
        const proof = await this.createSignerProof(did, pseudonym);

        // Verify KYC with enhanced privacy
        await this.kycManager.verifyIdentityWithPrivacy(
            did,
            'BASIC',
            kycProofs,
            [msg.sender]
        );

        // Store encrypted signer details
        const signer: VerifiedSigner = {
            did,
            kycStatus: 'verified',
            kycLevel: 'BASIC',
            kycTimestamp: Date.now(),
            signingKey: publicKey,
            pseudonym,
            encryptedDetails
        };

        // Store with additional privacy measures
        await this.storeSignerData(signer, proof);

        return pseudonym;
    }

    private async createSignerProof(
        did: string,
        pseudonym: string
    ): Promise<SignerProof> {
        const proofData = {
            did,
            pseudonym,
            timestamp: Date.now()
        };

        const zkProof = await this.sdk.generateZKProof(proofData);

        return {
            pseudonym,
            proofHash: createHash('sha256')
                .update(JSON.stringify(proofData))
                .digest('hex'),
            timestamp: proofData.timestamp,
            zkProof: zkProof.proof
        };
    }

    private async storeSignerData(
        signer: VerifiedSigner,
        proof: SignerProof
    ): Promise<void> {
        // Store with ZK proof
        const zkProof = await this.sdk.generateZKProof({
            signer,
            proof,
            timestamp: Date.now()
        });

        await this.sdk.submitShieldedTransaction(
            'storeSigner',
            [signer, proof],
            zkProof
        );

        // Update local mappings
        this.verifiedSigners.set(signer.did, signer);
        this.didToPseudonym.set(signer.did, signer.pseudonym);
        this.pseudonymToDid.set(signer.pseudonym, signer.did);

        if (!this.signerProofs.has(signer.pseudonym)) {
            this.signerProofs.set(signer.pseudonym, []);
        }
        this.signerProofs.get(signer.pseudonym)!.push(proof);
    }

    async verifySignerProof(
        pseudonym: string,
        proofHash: string
    ): Promise<boolean> {
        const proofs = this.signerProofs.get(pseudonym);
        if (!proofs) return false;

        return proofs.some(p => p.proofHash === proofHash);
    }

    async isSignerVerified(pseudonym: string): Promise<boolean> {
        const did = this.pseudonymToDid.get(pseudonym);
        if (!did) return false;

        const signer = this.verifiedSigners.get(did);
        return signer?.kycStatus === 'verified';
    }

    private async generatePseudonym(did: string): Promise<string> {
        const zkProof = await this.sdk.generateZKProof({
            did,
            timestamp: Date.now()
        });

        return `signer:${zkProof.proof.slice(0, 16)}`;
    }
} 
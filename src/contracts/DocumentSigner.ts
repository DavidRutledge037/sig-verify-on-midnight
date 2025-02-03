import { Contract, Address, msg } from '../types/index.js';
import { MidnightSDK } from '../sdk/midnight.js';
import { SignerRegistry } from './SignerRegistry.js';
import { createHash } from 'crypto';

export interface SignatureData {
    documentId: string;
    signerPseudonym: string; // Use pseudonym instead of DID
    timestamp: number;
    signatureHash: string;
    zkProof?: string;
}

export class DocumentSigner extends Contract {
    private sdk: MidnightSDK;
    private signerRegistry: SignerRegistry;
    private signatures: Map<string, Set<SignatureData>>;
    private requiredSigners: Map<string, Set<string>>;

    constructor(sdk: MidnightSDK, signerRegistry: SignerRegistry) {
        super();
        this.sdk = sdk;
        this.signerRegistry = signerRegistry;
        this.signatures = new Map();
        this.requiredSigners = new Map();
    }

    async addRequiredSigner(documentId: string, signerPseudonym: string): Promise<void> {
        // Verify signer is KYCed
        if (!await this.signerRegistry.isSignerVerified(signerPseudonym)) {
            throw new Error('Signer must complete KYC verification first');
        }

        if (!this.requiredSigners.has(documentId)) {
            this.requiredSigners.set(documentId, new Set());
        }
        this.requiredSigners.get(documentId)!.add(signerPseudonym);
    }

    async signDocument(
        documentId: string,
        signerPseudonym: string,
        privateKey: string
    ): Promise<string> {
        // Verify signer is KYCed
        if (!await this.signerRegistry.isSignerVerified(signerPseudonym)) {
            throw new Error('Signer must complete KYC verification first');
        }

        // Verify signer is required for this document
        const required = this.requiredSigners.get(documentId);
        if (!required?.has(signerPseudonym)) {
            throw new Error('Signer is not authorized to sign this document');
        }

        // Create signature with ZK proof
        const signatureData = {
            documentId,
            signerPseudonym,
            timestamp: Date.now(),
            signatureHash: this.generateSignatureHash(documentId, signerPseudonym, privateKey)
        };

        const zkProof = await this.sdk.generateZKProof({
            document: signatureData,
            signer: signerPseudonym,
            privateKey
        });

        // Submit as shielded transaction
        await this.sdk.submitShieldedTransaction(
            'signDocument',
            [signatureData],
            zkProof
        );

        // Store signature
        if (!this.signatures.has(documentId)) {
            this.signatures.set(documentId, new Set());
        }
        this.signatures.get(documentId)!.add(signatureData);

        return signatureData.signatureHash;
    }

    async verifySignature(
        documentId: string,
        signerPseudonym: string,
        signatureHash: string
    ): Promise<boolean> {
        const signatures = this.signatures.get(documentId);
        if (!signatures) return false;

        return Array.from(signatures).some(sig => 
            sig.signerPseudonym === signerPseudonym && 
            sig.signatureHash === signatureHash
        );
    }

    private generateSignatureHash(
        documentId: string,
        signerPseudonym: string,
        privateKey: string
    ): string {
        const data = `${documentId}|${signerPseudonym}|${Date.now()}`;
        return createHash('sha256')
            .update(data)
            .update(privateKey)
            .digest('hex');
    }
} 
import { Document } from 'mongodb';

export interface Proof extends Document {
    type: string;
    created: string;
    creator: string;
    signatureValue: string;
    data: any; // Consider making this more specific based on your needs
}

export interface ProofVerificationResult {
    isValid: boolean;
    error?: string;
}

export interface ProofSubmissionResult {
    success: boolean;
    proofId?: string;
    error?: string;
}

export interface ProofService {
    submitProof(proof: Proof): Promise<ProofSubmissionResult>;
    verifyProof(proofId: string): Promise<ProofVerificationResult>;
    getProof(proofId: string): Promise<Proof | null>;
}

export interface ProofStorageService {
    storeProof(proof: Proof): Promise<string>;
    getProof(proofId: string): Promise<Proof | null>;
    updateProof(proofId: string, updates: Partial<Proof>): Promise<boolean>;
    deleteProof(proofId: string): Promise<boolean>;
}

export interface ProofValidationOptions {
    validateSignature?: boolean;
    validateTimestamp?: boolean;
    validateCreator?: boolean;
}

export interface ProofMetadata {
    createdAt: string;
    updatedAt?: string;
    status: 'pending' | 'verified' | 'invalid';
    verifiedAt?: string;
    verifiedBy?: string;
} 
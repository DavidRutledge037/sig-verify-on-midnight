import { CryptoAlgorithm } from './DID';
import { MidnightSignatureParams } from './DID';

export interface Document {
    id: string;
    owner: string;
    hash: string;
    metadata: DocumentMetadata;
    signatures: DocumentSignature[];
    status: DocumentStatus;
    createdAt: number;
    updatedAt: number;
}

export interface DocumentMetadata {
    title: string;
    description?: string;
    mimeType: string;
    size: number;
    tags?: string[];
}

export interface DocumentSignature {
    signer: string;
    signature: string;
    timestamp: number;
    zkProof?: string;
}

export enum DocumentStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    SIGNED = 'SIGNED',
    REVOKED = 'REVOKED'
}

export interface SignedDocument {
    content: string;
    signature: string;
    signatureParams: MidnightSignatureParams;
    signerDID: string;
    keyId?: string;
}

export interface DocumentSigningOptions {
    proofPurpose?: 'authentication' | 'assertionMethod';
} 
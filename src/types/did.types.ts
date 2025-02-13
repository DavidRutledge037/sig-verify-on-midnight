import { Document } from 'mongodb';
import { KeyPair } from './key.types.js';
import { DIDDocument, DIDResolutionResult } from './did.types';

export type DIDStatus = 'active' | 'revoked' | 'suspended';

export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
}

export interface ServiceEndpoint {
    id: string;
    type: string;
    serviceEndpoint: string;
}

export interface DIDDocument extends Document {
    id: string;
    controller: string;
    verificationMethod: VerificationMethod[];
    authentication: string[];
    assertionMethod: string[];
    keyAgreement: string[];
    capabilityInvocation: string[];
    capabilityDelegation: string[];
    service: any[]; // Consider making this more specific based on your needs
    created: string;
    updated: string;
    status?: 'active' | 'revoked';
}

export interface DIDResolutionResult {
    didDocument: DIDDocument;
    didResolutionMetadata: {
        contentType: string;
    };
    didDocumentMetadata: {
        created: string;
    };
}

export interface DIDService {
    generateDID(): Promise<string>;
    validateDIDFormat(did: string): boolean;
    signWithDID(did: string, document: Uint8Array): Promise<Uint8Array>;
}

export interface DIDStorageOptions {
    collection?: string;
    indices?: { [key: string]: number }[];
}

export interface DIDProof {
    type: string;
    created: string;
    verificationMethod: string;
    proofValue: string;
}

export interface DIDVerificationResult {
    verified: boolean;
    reason?: string;
}
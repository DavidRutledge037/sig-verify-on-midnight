import { Document } from 'mongodb';

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
    status: DIDStatus;
}

export interface DIDResolutionResult {
    didDocument: DIDDocument;
    didResolutionMetadata: {
        contentType: string;
        error?: string;
    };
    didDocumentMetadata: {
        created: string;
        updated?: string;
        deactivated?: boolean;
        versionId?: string;
    };
}

export interface DIDService {
    createDID(): Promise<DIDDocument>;
    verifyDID(did: DIDDocument): Promise<boolean>;
    resolveDID(didId: string): Promise<DIDResolutionResult>;
    revokeDID(didId: string): Promise<boolean>;
    isValidDIDFormat(did: string): boolean;
    addService(didId: string, service: any): Promise<boolean>;
}

export interface DIDStorageOptions {
    collection?: string;
    indices?: { [key: string]: number }[];
}

export interface DIDVerificationResult {
    isValid: boolean;
    error?: string;
}
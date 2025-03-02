export enum KYCStatus {
    None = 0,
    Pending = 1,
    Verified = 2,
    Rejected = 3
}

export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
}

export interface Service {
    id: string;
    type: string;
    serviceEndpoint: string;
}

export interface DIDDocument {
    id: string;
    controller: string;
    verificationMethods: VerificationMethod[];
    services: Service[];
}

export interface KYCRecord {
    holder: string;
    status: KYCStatus;
    verifier: string;
    timestamp: string;
}

export interface DocumentMetadata {
    documentHash: string;
    documentType: string;
    ownerDID: string;
    multiParty: boolean;
    requiredSignatures: number;
    signerCount: number;
    version: number;
}

export interface SignatureInfo {
    signerDID: string;
    timestamp: string;
    kycVerified: boolean;
}

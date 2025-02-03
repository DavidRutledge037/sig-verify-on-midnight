export enum VerificationLevel {
    BASIC = 'BASIC',
    ADVANCED = 'ADVANCED',
    ENTERPRISE = 'ENTERPRISE'
}

export enum KYCStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}

export interface KYCData {
    userId: string;
    status: KYCStatus;
    verificationLevel: VerificationLevel;
    timestamp: number;
    expiryDate: number;
    verifier: string;
    proofHash: string;
}

export interface VerifiedIdentity {
    did: string;
    kycVerified: boolean;
    kycData: KYCData;
    zkProofs: Map<string, string>;
}
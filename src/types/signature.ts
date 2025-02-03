export interface SignatureMetadata {
    documentId: string;
    signerDid: string;
    timestamp: number;
    signatureType: 'basic' | 'zk';
}

export interface SignatureVerification {
    isValid: boolean;
    verifiedAt: number;
    verifier: string;
}

export interface SignatureRequest {
    documentId: string;
    requesterId: string;
    status: 'pending' | 'approved' | 'rejected';
    expiresAt: number;
} 
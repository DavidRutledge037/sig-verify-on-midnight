export interface KYCVerification {
    id: number;
    userId: number;
    verificationLevel: 'basic' | 'advanced';
    status: 'pending' | 'verified' | 'rejected';
    proofHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface KYCDocument {
    id: number;
    verificationId: number;
    documentType: string;
    documentHash: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
} 
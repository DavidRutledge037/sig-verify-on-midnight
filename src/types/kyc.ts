export interface KYCDocument {
    type: string;
    documentHash: string;
    metadata?: Record<string, any>;
}

export interface KYCSubmission {
    documents: KYCDocument[];
    metadata?: Record<string, any>;
}

export interface KYCStatus {
    status: 'pending' | 'approved' | 'rejected';
    address: string;
    documents: KYCDocument[];
    updatedAt: Date;
} 
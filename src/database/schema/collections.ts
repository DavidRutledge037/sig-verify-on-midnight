import { Collection, Document } from 'mongodb';
import { DIDDocument } from '../../identity/did';
import { KYCData } from '../../kyc/verification';

export interface UserDocument extends Document {
    did: DIDDocument;
    kyc: KYCData;
    createdAt: Date;
    updatedAt: Date;
}

export interface DocumentRecord extends Document {
    hash: string;
    metadata: {
        type: string;
        timestamp: number;
        owner: string;
    };
    status: 'draft' | 'pending' | 'signed';
    createdAt: Date;
    updatedAt: Date;
}

export interface SignatureRecord extends Document {
    documentId: string;
    signerId: string;
    signature: string;
    createdAt: Date;
    updatedAt: Date;
} 
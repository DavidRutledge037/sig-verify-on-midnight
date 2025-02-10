import { Collection, Db } from 'mongodb';
import { KYCVerification, KYCDocument } from './types';

export interface MongoKYCVerification extends Omit<KYCVerification, 'id'> {
    _id: string;
}

export interface MongoKYCDocument extends Omit<KYCDocument, 'id'> {
    _id: string;
}

export class MongoKYCRepository {
    private verifications: Collection<MongoKYCVerification>;
    private documents: Collection<MongoKYCDocument>;

    constructor(db: Db) {
        this.verifications = db.collection('kyc_verifications');
        this.documents = db.collection('kyc_documents');
    }

    async createVerification(userId: number, level: string): Promise<MongoKYCVerification> {
        const verification: Omit<MongoKYCVerification, '_id'> = {
            userId,
            verificationLevel: level as 'basic' | 'advanced',
            status: 'pending',
            proofHash: '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.verifications.insertOne(verification as MongoKYCVerification);
        return { ...verification, _id: result.insertedId.toString() };
    }

    async addDocument(verificationId: string, documentType: string, hash: string): Promise<MongoKYCDocument> {
        const document: Omit<MongoKYCDocument, '_id'> = {
            verificationId,
            documentType,
            documentHash: hash,
            verified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.documents.insertOne(document as MongoKYCDocument);
        return { ...document, _id: result.insertedId.toString() };
    }

    async updateVerificationStatus(id: string, status: string, proofHash: string): Promise<MongoKYCVerification | null> {
        const result = await this.verifications.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    status,
                    proofHash,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        return result.value;
    }
} 
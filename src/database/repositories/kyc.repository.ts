import { ObjectId, UpdateResult } from 'mongodb';
import { BaseRepository, BaseDocument } from './base.repository';

export interface KYCDocument {
    type: string;
    hash: string;
    verified: boolean;
}

export interface KYCRecord extends BaseDocument {
    userId: string;
    verificationLevel: 'basic' | 'advanced';
    status: 'pending' | 'verified' | 'rejected';
    proofHash: string;
    documents: KYCDocument[];
}

export class KYCRepository extends BaseRepository<KYCRecord> {
    async create(doc: Omit<KYCRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<KYCRecord> {
        const docWithTimestamps = this.addTimestamps(doc);
        const result = await this.collection.insertOne(docWithTimestamps);
        return { ...docWithTimestamps, _id: result.insertedId };
    }

    async findByUserId(userId: string): Promise<KYCRecord | null> {
        return this.collection.findOne({ userId });
    }

    async updateStatus(id: string, status: KYCRecord['status'], proofHash?: string): Promise<KYCRecord | null> {
        const update: Partial<KYCRecord> = { status };
        if (proofHash) {
            update.proofHash = proofHash;
        }
        
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: this.updateTimestamp(update) },
            { returnDocument: 'after' }
        );

        // Handle null case explicitly
        if (!result) {
            return null;
        }

        // MongoDB returns the document directly in newer versions
        return result as unknown as KYCRecord;
    }
} 
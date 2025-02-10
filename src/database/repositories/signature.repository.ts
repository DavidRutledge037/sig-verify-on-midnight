import { Collection } from 'mongodb';
import DatabaseClient from '../client';
import { SignatureRecord } from '../schema/collections';

export class SignatureRepository {
    private collection: Collection<SignatureRecord>;

    constructor() {
        const db = DatabaseClient.getInstance().getDb();
        this.collection = db.collection<SignatureRecord>('signatures');
    }

    async create(signature: Omit<SignatureRecord, '_id'>): Promise<SignatureRecord> {
        const now = new Date();
        const signatureWithTimestamps = {
            ...signature,
            createdAt: now,
            updatedAt: now
        };

        const result = await this.collection.insertOne(signatureWithTimestamps);
        return { ...signatureWithTimestamps, _id: result.insertedId };
    }

    async findByDocumentId(documentId: string): Promise<SignatureRecord[]> {
        return this.collection.find({ documentId }).toArray();
    }

    async findBySignerId(signerId: string): Promise<SignatureRecord[]> {
        return this.collection.find({ signerId }).toArray();
    }
} 
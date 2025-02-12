import { Collection, ObjectId } from 'mongodb';
import DatabaseClient from '../client';
import { BaseRepository, BaseDocument } from './base.repository';

export interface DocumentRecord extends BaseDocument {
    hash: string;
    metadata: Record<string, any>;
    status: 'pending' | 'verified' | 'rejected';
}

export class DocumentRepository extends BaseRepository<DocumentRecord> {
    private collection: Collection<DocumentRecord>;

    constructor() {
        const db = DatabaseClient.getInstance().getDb();
        this.collection = db.collection<DocumentRecord>('documents');
    }

    async create(doc: Omit<DocumentRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<DocumentRecord> {
        const documentWithTimestamps = this.addTimestamps(doc);
        const result = await this.collection.insertOne(documentWithTimestamps);
        return { ...documentWithTimestamps, _id: result.insertedId };
    }

    async findById(id: string): Promise<DocumentRecord | null> {
        return this.collection.findOne({ _id: new ObjectId(id) });
    }

    async update(id: string, update: Partial<DocumentRecord>): Promise<DocumentRecord | null> {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: this.updateTimestamp(update) },
            { returnDocument: 'after' }
        );
        return result.value;
    }

    async findByHash(hash: string): Promise<DocumentRecord | null> {
        return this.collection.findOne({ hash });
    }

    async updateStatus(id: string, status: DocumentRecord['status']): Promise<DocumentRecord | null> {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    status,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );
        return result.value;
    }
} 
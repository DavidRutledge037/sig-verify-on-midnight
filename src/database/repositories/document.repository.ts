import { Collection } from 'mongodb';
import DatabaseClient from '../client';
import { DocumentRecord } from '../schema/collections';

export class DocumentRepository {
    private collection: Collection<DocumentRecord>;

    constructor() {
        const db = DatabaseClient.getInstance().getDb();
        this.collection = db.collection<DocumentRecord>('documents');
    }

    async create(document: Omit<DocumentRecord, '_id'>): Promise<DocumentRecord> {
        const now = new Date();
        const documentWithTimestamps = {
            ...document,
            createdAt: now,
            updatedAt: now
        };

        const result = await this.collection.insertOne(documentWithTimestamps);
        return { ...documentWithTimestamps, _id: result.insertedId };
    }

    async findByHash(hash: string): Promise<DocumentRecord | null> {
        return this.collection.findOne({ hash });
    }

    async updateStatus(id: string, status: DocumentRecord['status']): Promise<DocumentRecord | null> {
        const result = await this.collection.findOneAndUpdate(
            { _id: id },
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
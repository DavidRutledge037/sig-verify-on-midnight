import { Collection, ObjectId } from 'mongodb';
import { DatabaseClient } from '../client';

export interface BaseDocument {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class BaseRepository<T extends BaseDocument> {
    protected collection: Collection<T>;

    constructor(
        protected dbClient: DatabaseClient,
        collectionName: string
    ) {
        this.collection = dbClient.getCollection<T>(collectionName);
    }

    protected addTimestamps(doc: Partial<T>): T {
        const now = new Date();
        return {
            ...doc,
            createdAt: now,
            updatedAt: now
        } as T;
    }

    protected updateTimestamp(doc: Partial<T>): Partial<T> {
        return {
            ...doc,
            updatedAt: new Date()
        };
    }
} 
import { Collection } from 'mongodb';
import DatabaseClient from '../client';
import { UserDocument } from '../schema/collections';

export class UserRepository {
    private collection: Collection<UserDocument>;

    constructor() {
        const db = DatabaseClient.getInstance().getDb();
        this.collection = db.collection<UserDocument>('users');
    }

    async create(user: Omit<UserDocument, '_id'>): Promise<UserDocument> {
        const now = new Date();
        const userWithTimestamps = {
            ...user,
            createdAt: now,
            updatedAt: now
        };

        const result = await this.collection.insertOne(userWithTimestamps);
        return { ...userWithTimestamps, _id: result.insertedId };
    }

    async findByDid(did: string): Promise<UserDocument | null> {
        return this.collection.findOne({ 'did.id': did });
    }

    async update(id: string, update: Partial<UserDocument>): Promise<UserDocument | null> {
        const result = await this.collection.findOneAndUpdate(
            { _id: id },
            { 
                $set: { 
                    ...update,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );
        return result.value;
    }
} 
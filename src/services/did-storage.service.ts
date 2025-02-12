import { Collection, Document } from 'mongodb';
import { DIDDocument } from '../types/did.types';
import { DatabaseService } from './database';
import { IStorageService } from '../types/services';

export class DIDStorageService implements IStorageService {
    private collection: Collection<Document>;
    readonly COLLECTION_NAME = 'dids';

    constructor(private dbService: DatabaseService) {}

    async initialize(): Promise<void> {
        this.collection = await this.dbService.getCollection<DIDDocument>(this.COLLECTION_NAME);
        await this.collection.createIndex({ id: 1 }, { unique: true });
    }

    async getDID(id: string): Promise<DIDDocument | null> {
        return this.collection.findOne<DIDDocument>({ id });
    }

    async storeDID(did: DIDDocument): Promise<void> {
        await this.collection.insertOne(did);
    }

    async updateDID(did: DIDDocument): Promise<boolean> {
        const result = await this.collection.updateOne(
            { id: did.id },
            { $set: did }
        );
        return result.modifiedCount > 0;
    }

    async deleteDID(id: string): Promise<void> {
        await this.collection.deleteOne({ id });
    }

    async getDIDsByController(controller: string): Promise<DIDDocument[]> {
        return this.collection.find<DIDDocument>({ controller }).toArray();
    }

    async getDIDsByStatus(status: string): Promise<DIDDocument[]> {
        return this.collection.find<DIDDocument>({ status }).toArray();
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.collection.countDocuments({ id }, { limit: 1 });
        return count > 0;
    }
} 
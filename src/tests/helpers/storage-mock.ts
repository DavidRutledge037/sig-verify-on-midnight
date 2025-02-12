import { Collection } from 'mongodb';
import { DIDDocument } from '../../services/did.service';

export class StorageMock {
    private documents: Map<string, DIDDocument> = new Map();

    async createIndex(): Promise<string> {
        return 'mock_index';
    }

    async findOne(query: { id: string }): Promise<DIDDocument | null> {
        return this.documents.get(query.id) || null;
    }

    async find(query: any): Promise<{ toArray: () => Promise<DIDDocument[]> }> {
        const docs = Array.from(this.documents.values())
            .filter(doc => {
                for (const [key, value] of Object.entries(query)) {
                    if (doc[key as keyof DIDDocument] !== value) return false;
                }
                return true;
            });
        return {
            toArray: async () => docs
        };
    }

    async updateOne(
        query: { id: string },
        update: { $set: Partial<DIDDocument> },
        options: { upsert: boolean }
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        const doc = this.documents.get(query.id);
        if (doc || options.upsert) {
            this.documents.set(query.id, {
                ...(doc || {}),
                ...update.$set
            } as DIDDocument);
            return { matchedCount: doc ? 1 : 0, modifiedCount: 1 };
        }
        return { matchedCount: 0, modifiedCount: 0 };
    }

    async deleteOne(query: { id: string }): Promise<{ deletedCount: number }> {
        const deleted = this.documents.delete(query.id);
        return { deletedCount: deleted ? 1 : 0 };
    }

    reset(): void {
        this.documents.clear();
    }
}

export const getCollectionMock = (): Collection<DIDDocument> => {
    return new StorageMock() as unknown as Collection<DIDDocument>;
}; 
import { DatabaseClient } from '../client';
import { Document } from '../../models/types';

export class DocumentRepository {
    constructor(private client: DatabaseClient) {}

    async create(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
        const result = await this.client.query<Document>(
            'INSERT INTO documents (hash, content) VALUES ($1, $2) RETURNING *',
            [document.hash, document.content]
        );
        return result[0];
    }

    async findById(id: number): Promise<Document | null> {
        const result = await this.client.query<Document>(
            'SELECT * FROM documents WHERE id = $1',
            [id]
        );
        return result[0] || null;
    }

    async findByHash(hash: string): Promise<Document | null> {
        const result = await this.client.query<Document>(
            'SELECT * FROM documents WHERE hash = $1',
            [hash]
        );
        return result[0] || null;
    }
} 
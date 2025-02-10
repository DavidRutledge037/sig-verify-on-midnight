import { DatabaseClient } from '../client';
import { Signature } from '../../models/types';

export class SignatureRepository {
    constructor(private client: DatabaseClient) {}

    async create(signature: Omit<Signature, 'id' | 'createdAt' | 'updatedAt'>): Promise<Signature> {
        const result = await this.client.query<Signature>(
            'INSERT INTO signatures (document_id, signer_id, signature) VALUES ($1, $2, $3) RETURNING *',
            [signature.documentId, signature.signerId, signature.signature]
        );
        return result[0];
    }

    async findByDocumentId(documentId: number): Promise<Signature[]> {
        return await this.client.query<Signature>(
            'SELECT * FROM signatures WHERE document_id = $1',
            [documentId]
        );
    }

    async findBySignerId(signerId: number): Promise<Signature[]> {
        return await this.client.query<Signature>(
            'SELECT * FROM signatures WHERE signer_id = $1',
            [signerId]
        );
    }
} 
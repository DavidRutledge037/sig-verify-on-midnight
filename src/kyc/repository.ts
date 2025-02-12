import { Pool } from 'pg';
import { KYCVerification, KYCDocument } from './types';

export class KYCRepository {
    constructor(private pool: Pool) {}

    async createVerification(userId: number, level: string): Promise<KYCVerification> {
        const result = await this.pool.query(
            `INSERT INTO kyc_verifications 
            (user_id, verification_level, status, proof_hash) 
            VALUES ($1, $2, 'pending', $3) 
            RETURNING *`,
            [userId, level, ''] // proof_hash will be updated after ZK proof generation
        );
        return result.rows[0];
    }

    async addDocument(verificationId: number, documentType: string, hash: string): Promise<KYCDocument> {
        const result = await this.pool.query(
            `INSERT INTO kyc_documents 
            (verification_id, document_type, document_hash) 
            VALUES ($1, $2, $3) 
            RETURNING *`,
            [verificationId, documentType, hash]
        );
        return result.rows[0];
    }

    async updateVerificationStatus(id: number, status: string, proofHash: string): Promise<KYCVerification> {
        const result = await this.pool.query(
            `UPDATE kyc_verifications 
            SET status = $1, proof_hash = $2, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $3 
            RETURNING *`,
            [status, proofHash, id]
        );
        return result.rows[0];
    }
} 
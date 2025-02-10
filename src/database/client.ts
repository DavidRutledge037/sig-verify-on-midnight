import { Pool, PoolClient } from 'pg';
import { DatabaseConfig } from '../config/database';

export class DatabaseClient {
    private pool: Pool;

    constructor(config: DatabaseConfig) {
        this.pool = new Pool(config);
    }

    async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } finally {
            client.release();
        }
    }

    async getClient(): Promise<PoolClient> {
        return await this.pool.connect();
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
} 
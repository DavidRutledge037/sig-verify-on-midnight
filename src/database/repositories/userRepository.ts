import { DatabaseClient } from '../client';
import { User } from '../../models/types';

export class UserRepository {
    constructor(private client: DatabaseClient) {}

    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const result = await this.client.query<User>(
            'INSERT INTO users (did, public_key) VALUES ($1, $2) RETURNING *',
            [user.did, user.publicKey]
        );
        return result[0];
    }

    async findByDid(did: string): Promise<User | null> {
        const result = await this.client.query<User>(
            'SELECT * FROM users WHERE did = $1',
            [did]
        );
        return result[0] || null;
    }

    async findById(id: number): Promise<User | null> {
        const result = await this.client.query<User>(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result[0] || null;
    }
} 
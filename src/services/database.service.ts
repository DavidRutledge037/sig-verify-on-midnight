import { Collection, MongoClient } from 'mongodb';
import { DatabaseClient } from '../database/client.js';

export class DatabaseService {
    private client: DatabaseClient | null = null;
    
    constructor(private readonly uri: string) {}
    
    async connect(): Promise<void> {
        if (!this.client) {
            this.client = await DatabaseClient.getInstance(this.uri);
        }
    }
    
    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
        }
    }
    
    getCollection<T>(name: string): Collection<T> {
        if (!this.client) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.client.getCollection<T>(name);
    }
    
    isConnected(): boolean {
        return this.client !== null && this.client.isInitialized();
    }
} 
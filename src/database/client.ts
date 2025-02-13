import { MongoClient, Collection, Db } from 'mongodb';

export class DatabaseClient {
    private static instance: DatabaseClient;
    private client: MongoClient;
    private db: Db | null = null;
    private initialized: boolean = false;

    constructor(uri: string) {
        this.client = new MongoClient(uri);
    }

    static async getInstance(uri: string): Promise<DatabaseClient> {
        if (!DatabaseClient.instance) {
            DatabaseClient.instance = new DatabaseClient(uri);
            await DatabaseClient.instance.connect();
        }
        return DatabaseClient.instance;
    }

    async connect(): Promise<void> {
        if (!this.initialized) {
            await this.client.connect();
            this.db = this.client.db();
            this.initialized = true;
        }
    }

    async close(): Promise<void> {
        if (this.initialized) {
            await this.client.close();
            this.initialized = false;
            this.db = null;
        }
    }

    getCollection<T>(name: string): Collection<T> {
        if (!this.db) {
            throw new Error('Database not initialized. Call connect() first.');
        }
        return this.db.collection<T>(name);
    }

    isInitialized(): boolean {
        return this.initialized;
    }

    getClient(): MongoClient {
        return this.client;
    }
} 
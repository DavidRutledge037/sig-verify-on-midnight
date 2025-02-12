import { MongoClient, Db, Collection, Document } from 'mongodb';

export class DatabaseClient {
    private client: MongoClient;
    private db: Db | null = null;
    private readonly dbName: string;

    constructor(uri: string, dbName: string = 'default') {
        this.client = new MongoClient(uri);
        this.dbName = dbName;
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log('Connected to database successfully');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    getDb(): Db {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        return this.db;
    }

    getCollection<T extends Document>(name: string): Collection<T> {
        return this.getDb().collection<T>(name);
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.db = null;
        }
    }
}

export default DatabaseClient; 
import { Collection, Db, Document, MongoClient } from 'mongodb';

export interface IDatabaseService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getCollection<T extends Document>(name: string): Promise<Collection<T>>;
}

export class DatabaseService implements IDatabaseService {
    private client: MongoClient;
    private db!: Db;
    private isConnected: boolean = false;

    constructor(
        private readonly uri: string,
        private readonly dbName: string
    ) {
        this.client = new MongoClient(uri);
    }

    async connect(): Promise<void> {
        if (!this.isConnected) {
            try {
                await this.client.connect();
                this.db = this.client.db(this.dbName);
                this.isConnected = true;
            } catch (error) {
                console.error('Failed to connect to database:', error);
                throw new Error('Database connection failed');
            }
        }
    }

    async disconnect(): Promise<void> {
        if (this.isConnected) {
            try {
                await this.client.close();
                this.isConnected = false;
            } catch (error) {
                console.error('Failed to disconnect from database:', error);
                throw new Error('Database disconnection failed');
            }
        }
    }

    async getCollection<T extends Document>(name: string): Promise<Collection<T>> {
        if (!this.isConnected) {
            await this.connect();
        }
        return this.db.collection<T>(name);
    }

    getClient(): MongoClient {
        return this.client;
    }

    isConnectedToDatabase(): boolean {
        return this.isConnected;
    }

    getDatabaseName(): string {
        return this.dbName;
    }
} 
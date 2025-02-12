import { Collection, Db, Document, MongoClient } from 'mongodb';

export interface DatabaseConfig {
    uri: string;
    dbName: string;
    options?: {
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
    };
}

export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getCollection<T extends Document>(name: string): Collection<T>;
    isConnected(): boolean;
    getClient(): MongoClient;
    getDb(): Db;
} 
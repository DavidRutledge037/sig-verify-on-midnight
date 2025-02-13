import type { Collection, MongoClient } from 'mongodb';

// Generic Repository Interface
export interface IRepository<T> {
    findById(id: string): Promise<T | null>;
    findOne(filter: Partial<T>): Promise<T | null>;
    findMany(filter: Partial<T>): Promise<T[]>;
    create(entity: T): Promise<string>;
    update(id: string, entity: Partial<T>): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

// Generic Repository Implementation
export class Repository<T> implements IRepository<T> {
    constructor(
        private readonly collection: Collection<T>
    ) {}

    async findById(id: string): Promise<T | null> {
        return this.collection.findOne({ _id: id } as any);
    }

    async findOne(filter: Partial<T>): Promise<T | null> {
        return this.collection.findOne(filter as any);
    }

    async findMany(filter: Partial<T>): Promise<T[]> {
        return this.collection.find(filter as any).toArray();
    }

    async create(entity: T): Promise<string> {
        const result = await this.collection.insertOne(entity as any);
        return result.insertedId.toString();
    }

    async update(id: string, entity: Partial<T>): Promise<boolean> {
        const result = await this.collection.updateOne(
            { _id: id } as any,
            { $set: entity }
        );
        return result.modifiedCount > 0;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: id } as any);
        return result.deletedCount > 0;
    }
}

// Unit of Work Interface
export interface IUnitOfWork {
    startTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
    getRepository<T>(name: string): IRepository<T>;
}

// Unit of Work Implementation
export class UnitOfWork implements IUnitOfWork {
    private client: MongoClient;
    private repositories: Map<string, IRepository<any>> = new Map();

    constructor(client: MongoClient) {
        this.client = client;
    }

    async startTransaction(): Promise<void> {
        const session = this.client.startSession();
        session.startTransaction();
    }

    async commitTransaction(): Promise<void> {
        const session = this.client.startSession();
        await session.commitTransaction();
    }

    async rollbackTransaction(): Promise<void> {
        const session = this.client.startSession();
        await session.abortTransaction();
    }

    getRepository<T>(name: string): IRepository<T> {
        if (!this.repositories.has(name)) {
            const collection = this.client.db().collection<T>(name);
            this.repositories.set(name, new Repository<T>(collection));
        }
        return this.repositories.get(name)!;
    }
} 
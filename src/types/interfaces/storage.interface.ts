import { Collection, Document } from 'mongodb';
import { IService } from './service.interface';

export interface IStorage<T extends Document> extends IService {
    getCollection(): Collection<T>;
    exists(id: string): Promise<boolean>;
    get(id: string): Promise<T | null>;
    store(document: T): Promise<void>;
    update(id: string, document: Partial<T>): Promise<boolean>;
    delete(id: string): Promise<boolean>;
} 
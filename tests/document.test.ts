import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DatabaseClient } from '../src/database/client';
import { defaultConfig } from '../src/config/database';
import { DocumentRepository } from '../src/database/repositories/documentRepository';

describe('Document Repository Tests', () => {
    let client: DatabaseClient;
    let documentRepo: DocumentRepository;

    beforeAll(() => {
        client = new DatabaseClient(defaultConfig);
        documentRepo = new DocumentRepository(client);
    });

    afterAll(async () => {
        await client.close();
    });

    it('should create and retrieve a document', async () => {
        const doc = await documentRepo.create({
            hash: 'test-hash-1',
            content: 'test-content-1'
        });

        expect(doc.hash).toBe('test-hash-1');
        expect(doc.content).toBe('test-content-1');

        const found = await documentRepo.findByHash('test-hash-1');
        expect(found?.content).toBe('test-content-1');
    });
});

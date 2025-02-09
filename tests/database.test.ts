import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DatabaseClient } from '../src/database/client';
import { defaultConfig } from '../src/config/database';
import { UserRepository } from '../src/database/repositories/userRepository';
import { DocumentRepository } from '../src/database/repositories/documentRepository';
import { SignatureRepository } from '../src/database/repositories/signatureRepository';

describe('Database Integration Tests', () => {
    let client: DatabaseClient;
    let userRepo: UserRepository;
    let documentRepo: DocumentRepository;
    let signatureRepo: SignatureRepository;

    beforeAll(() => {
        client = new DatabaseClient(defaultConfig);
        userRepo = new UserRepository(client);
        documentRepo = new DocumentRepository(client);
        signatureRepo = new SignatureRepository(client);
    });

    afterAll(async () => {
        await client.close();
    });

    it('should connect to the database', async () => {
        const result = await client.query('SELECT NOW()');
        expect(result).toBeDefined();
    });

    it('should create and find a user', async () => {
        const user = await userRepo.create({
            did: 'did:example:123',
            publicKey: 'test-public-key'
        });
        expect(user.id).toBeDefined();
        expect(user.did).toBe('did:example:123');

        const found = await userRepo.findByDid('did:example:123');
        expect(found).toBeDefined();
        expect(found?.publicKey).toBe('test-public-key');
    });

    it('should create and find a document', async () => {
        const doc = await documentRepo.create({
            hash: 'test-hash',
            content: 'test-content'
        });
        expect(doc.id).toBeDefined();
        expect(doc.hash).toBe('test-hash');

        const found = await documentRepo.findByHash('test-hash');
        expect(found).toBeDefined();
        expect(found?.content).toBe('test-content');
    });
});

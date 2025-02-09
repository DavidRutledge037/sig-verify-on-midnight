import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DatabaseClient } from '../src/database/client';
import { defaultConfig } from '../src/config/database';
import { SignatureRepository } from '../src/database/repositories/signatureRepository';
import { UserRepository } from '../src/database/repositories/userRepository';
import { DocumentRepository } from '../src/database/repositories/documentRepository';

describe('Signature Repository Tests', () => {
    let client: DatabaseClient;
    let signatureRepo: SignatureRepository;
    let userRepo: UserRepository;
    let documentRepo: DocumentRepository;

    beforeAll(() => {
        client = new DatabaseClient(defaultConfig);
        signatureRepo = new SignatureRepository(client);
        userRepo = new UserRepository(client);
        documentRepo = new DocumentRepository(client);
    });

    afterAll(async () => {
        await client.close();
    });

    it('should create and retrieve a signature', async () => {
        const user = await userRepo.create({
            did: 'did:example:signer1',
            publicKey: 'test-key-signer1'
        });

        const doc = await documentRepo.create({
            hash: 'test-hash-sig1',
            content: 'test-content-sig1'
        });

        const signature = await signatureRepo.create({
            documentId: doc.id!,
            signerId: user.id!,
            signature: 'test-signature-1'
        });

        expect(signature.signature).toBe('test-signature-1');

        const found = await signatureRepo.findByDocumentId(doc.id!);
        expect(found[0].signature).toBe('test-signature-1');
    });
});

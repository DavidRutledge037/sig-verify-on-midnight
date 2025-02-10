import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DatabaseClient } from '../src/database/client';
import { defaultConfig } from '../src/config/database';
import { UserRepository } from '../src/database/repositories/userRepository';

describe('User Repository Tests', () => {
    let client: DatabaseClient;
    let userRepo: UserRepository;

    beforeAll(() => {
        client = new DatabaseClient(defaultConfig);
        userRepo = new UserRepository(client);
    });

    afterAll(async () => {
        await client.close();
    });

    it('should create and retrieve a user', async () => {
        const user = await userRepo.create({
            did: 'did:example:user1',
            publicKey: 'test-key-1'
        });

        expect(user.did).toBe('did:example:user1');
        expect(user.publicKey).toBe('test-key-1');

        const found = await userRepo.findByDid('did:example:user1');
        expect(found?.publicKey).toBe('test-key-1');
    });
});

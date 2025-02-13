import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { UserRepository } from '../../../src/database/repositories/user.repository';
import { DatabaseClient } from '../../../src/database/client';

describe('UserRepository', () => {
    let repository: UserRepository;

    beforeAll(async () => {
        await DatabaseClient.getInstance().connect();
        repository = new UserRepository();
    });

    beforeEach(async () => {
        // Clean up existing data
        const client = await DatabaseClient.getInstance();
        await client.query('DELETE FROM users');
    });

    afterAll(async () => {
        await DatabaseClient.getInstance().close();
    });

    it('should create a new user', async () => {
        const mockUser = {
            did: {
                id: 'did:midnight:test',
                controller: ['did:midnight:test'],
                verificationMethod: [],
                authentication: []
            },
            kyc: {
                userId: 'test',
                verificationLevel: 'basic' as const,
                status: 'pending' as const,
                documents: []
            }
        };

        const result = await repository.create(mockUser);
        expect(result._id).toBeDefined();
        expect(result.did.id).toBe(mockUser.did.id);
    });

    it('should find user by DID', async () => {
        const did = 'did:midnight:test';
        const user = await repository.findByDid(did);
        expect(user).toBeDefined();
        expect(user?.did.id).toBe(did);
    });
}); 
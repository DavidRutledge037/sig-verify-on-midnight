import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { DIDService } from '../../src/services/did.service';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { DIDResolverService } from '../../src/services/did-resolver.service';
import { DIDRevocationService } from '../../src/services/did-revocation.service';
import { WalletService } from '../../src/services/wallet';
import { DatabaseService } from '../../src/services/database';

describe('DID Flow E2E Tests', () => {
    let dbService: DatabaseService;
    let didService: DIDService;
    let storageService: DIDStorageService;
    let resolverService: DIDResolverService;
    let revocationService: DIDRevocationService;
    let walletService: WalletService;

    beforeAll(async () => {
        // Initialize services
        dbService = new DatabaseService(process.env.MONGODB_URI || 'mongodb://localhost:27017', 'test-db');
        await dbService.connect();
        
        walletService = new WalletService();
        didService = new DIDService(walletService);
        storageService = new DIDStorageService();
        resolverService = new DIDResolverService([], storageService);
        revocationService = new DIDRevocationService(storageService, walletService);
    });

    afterAll(async () => {
        await dbService.disconnect();
    });

    it('should complete full DID lifecycle', async () => {
        // Create DID
        const did = await didService.createDID();
        expect(did).toBeDefined();
        expect(did.id).toMatch(/^did:midnight:/);

        // Store DID
        await storageService.storeDID(did);

        // Resolve DID
        const resolved = await resolverService.resolve(did.id);
        expect(resolved.didDocument).toEqual(did);
        expect(resolved.status).toBe('active');

        // Update DID
        const updatedDID = { ...did, service: [{ id: 'test', type: 'test', serviceEndpoint: 'test' }] };
        await storageService.updateDID(updatedDID);

        // Resolve updated DID
        const resolvedUpdated = await resolverService.resolve(did.id);
        expect(resolvedUpdated.didDocument).toEqual(updatedDID);

        // Revoke DID
        await revocationService.revokeDID(did.id);

        // Verify revocation
        const resolvedRevoked = await resolverService.resolve(did.id);
        expect(resolvedRevoked.status).toBe('revoked');
    });

    // ... additional test cases ...
}); 
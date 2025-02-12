import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DIDService } from '../../src/services/did.service';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { DIDResolverService } from '../../src/services/did-resolver.service';
import { DIDRevocationService } from '../../src/services/did-revocation.service';
import { WalletService } from '../../src/services/wallet';
import { Collection } from 'mongodb';

describe('DID Integration', () => {
    let didService: DIDService;
    let storageService: DIDStorageService;
    let resolverService: DIDResolverService;
    let revocationService: DIDRevocationService;
    let walletService: WalletService;
    let mockCollection: jest.Mocked<Collection>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn()
        } as unknown as jest.Mocked<Collection>;

        walletService = new WalletService();
        didService = new DIDService(walletService);
        storageService = new DIDStorageService();
        (storageService as any).collection = mockCollection;
        resolverService = new DIDResolverService([], storageService);
        revocationService = new DIDRevocationService(storageService, walletService);
    });

    it('should create and resolve DID', async () => {
        const did = await didService.createDID();
        expect(did).toBeDefined();
        expect(did.id).toMatch(/^did:midnight:/);

        mockCollection.findOne.mockResolvedValue(did);
        const resolved = await resolverService.resolve(did.id);
        expect(resolved.status).toBe('active');
        expect(resolved.didDocument).toEqual(did);
    });

    // ... rest of tests ...
}); 
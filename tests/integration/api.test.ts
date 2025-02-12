import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { APIService } from '../../src/services/api';
import { DIDService } from '../../src/services/did.service';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { WalletService } from '../../src/services/wallet';
import { Collection } from 'mongodb';

describe('API Integration', () => {
    let apiService: APIService;
    let didService: DIDService;
    let storageService: DIDStorageService;
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
        apiService = new APIService(didService, storageService);
    });

    it('should create DID through API', async () => {
        const did = await apiService.createDID();
        expect(did).toBeDefined();
        expect(did.id).toMatch(/^did:midnight:/);
        expect(mockCollection.insertOne).toHaveBeenCalled();
    });

    it('should resolve DID through API', async () => {
        const testDID = await didService.createDID();
        mockCollection.findOne.mockResolvedValue(testDID);

        const resolved = await apiService.resolveDID(testDID.id);
        expect(resolved).toBeDefined();
        expect(resolved.id).toBe(testDID.id);
    });

    // ... rest of tests ...
}); 
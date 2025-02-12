import { jest } from '@jest/globals';
import { DIDService } from '../services/did.service';
import { DIDStorageService } from '../services/did-storage.service';
import { DIDRevocationService } from '../services/did-revocation.service';
import { DatabaseService } from '../services/database';
import { WalletService } from '../services/wallet.service';
import { DIDDocument } from '../types/did.types';
import { Collection, Db, MongoClient } from 'mongodb';

describe('DID Integration Tests', () => {
    let didService: DIDService;
    let storageService: DIDStorageService;
    let revocationService: DIDRevocationService;
    let dbService: DatabaseService;
    let walletService: WalletService;
    let mockCollection: jest.Mocked<Collection>;
    let mockDb: Partial<Db>;
    let mockClient: Partial<MongoClient>;

    const mockKeyPair = {
        publicKey: new Uint8Array([1, 2, 3]),
        privateKey: new Uint8Array([4, 5, 6])
    };

    const testDID: DIDDocument = {
        id: 'did:midnight:test123',
        controller: 'did:midnight:controller123',
        verificationMethod: [],
        authentication: [],
        assertionMethod: [],
        keyAgreement: [],
        capabilityInvocation: [],
        capabilityDelegation: [],
        service: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        status: 'active'
    };

    beforeEach(() => {
        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            createIndex: jest.fn()
        } as unknown as jest.Mocked<Collection>;

        mockDb = {
            collection: jest.fn().mockReturnValue(mockCollection)
        };

        mockClient = {
            db: jest.fn().mockReturnValue(mockDb),
            connect: jest.fn().mockResolvedValue(undefined),
            close: jest.fn().mockResolvedValue(undefined)
        };

        dbService = new DatabaseService('mongodb://localhost:27017', 'test-db');
        // @ts-ignore - for testing purposes
        dbService['client'] = mockClient;
        // @ts-ignore - for testing purposes
        dbService['db'] = mockDb;

        walletService = {
            keyManager: {
                generateKeyPair: jest.fn().mockResolvedValue(mockKeyPair),
                sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
                verify: jest.fn().mockResolvedValue(true)
            },
            currentKeyPair: mockKeyPair,
            createWallet: jest.fn().mockResolvedValue(undefined),
            sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
            verify: jest.fn().mockResolvedValue(true),
            getAddress: jest.fn().mockReturnValue('midnight1test123')
        } as unknown as WalletService;

        storageService = new DIDStorageService(dbService);
        didService = new DIDService(walletService);
        revocationService = new DIDRevocationService(storageService, walletService);

        // Setup default mock responses
        mockCollection.findOne.mockResolvedValue(testDID);
        mockCollection.insertOne.mockResolvedValue({ 
            acknowledged: true,
            insertedId: testDID.id 
        });
        mockCollection.updateOne.mockResolvedValue({ 
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1
        });
    });

    it('should create and store a DID', async () => {
        const did = await didService.createDID(mockKeyPair.publicKey);
        expect(did).toBeDefined();
        expect(did.id).toMatch(/^did:midnight:/);
        expect(did.status).toBe('active');
    });

    it('should revoke a DID', async () => {
        const result = await revocationService.revokeDID(testDID.id);
        expect(result).toBe(true);
        expect(mockCollection.updateOne).toHaveBeenCalledWith(
            { id: testDID.id },
            { $set: { status: 'revoked', updated: expect.any(String) } }
        );
    });

    it('should verify DID status', async () => {
        const isRevoked = await revocationService.isRevoked(testDID.id);
        expect(isRevoked).toBe(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { DIDStorageService } from '../../src/services/did-storage.service';
import { createMockDIDDocument } from '../utils/test-helpers';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../utils/mock-database';
import { DatabaseService } from '../../src/services/database';

describe('DIDStorageService', () => {
    let storageService: DIDStorageService;
    let dbService: DatabaseService;

    beforeEach(async () => {
        const setup = await setupTestDatabase();
        dbService = setup.dbService;
        storageService = setup.storageService;
    });

    afterEach(async () => {
        await clearTestDatabase();
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    describe('storeDID', () => {
        it('should store a DID document', async () => {
            const mockDID = createMockDIDDocument();
            await storageService.storeDID(mockDID);
            
            const stored = await storageService.getDID(mockDID.id);
            expect(stored).toBeDefined();
            expect(stored?.id).toBe(mockDID.id);
        });

        it('should reject duplicate DIDs', async () => {
            const mockDID = createMockDIDDocument();
            await storageService.storeDID(mockDID);
            
            await expect(storageService.storeDID(mockDID))
                .rejects
                .toThrow();
        });
    });

    describe('getDID', () => {
        it('should retrieve a stored DID', async () => {
            const mockDID = createMockDIDDocument();
            await storageService.storeDID(mockDID);
            
            const retrieved = await storageService.getDID(mockDID.id);
            expect(retrieved).toEqual(mockDID);
        });

        it('should return null for non-existent DID', async () => {
            const retrieved = await storageService.getDID('did:midnight:nonexistent');
            expect(retrieved).toBeNull();
        });
    });

    describe('updateDID', () => {
        it('should update an existing DID', async () => {
            const mockDID = createMockDIDDocument();
            await storageService.storeDID(mockDID);
            
            const updatedDID = {
                ...mockDID,
                service: [{ id: 'test', type: 'test', serviceEndpoint: 'test' }]
            };
            
            const success = await storageService.updateDID(updatedDID);
            expect(success).toBe(true);
            
            const retrieved = await storageService.getDID(mockDID.id);
            expect(retrieved?.service).toEqual(updatedDID.service);
        });

        it('should return false for non-existent DID', async () => {
            const mockDID = createMockDIDDocument();
            const success = await storageService.updateDID(mockDID);
            expect(success).toBe(false);
        });
    });

    describe('deleteDID', () => {
        it('should delete an existing DID', async () => {
            const mockDID = createMockDIDDocument();
            await storageService.storeDID(mockDID);
            
            const success = await storageService.deleteDID(mockDID.id);
            expect(success).toBe(true);
            
            const retrieved = await storageService.getDID(mockDID.id);
            expect(retrieved).toBeNull();
        });

        it('should return false for non-existent DID', async () => {
            const success = await storageService.deleteDID('did:midnight:nonexistent');
            expect(success).toBe(false);
        });
    });

    describe('getDIDsByController', () => {
        it('should retrieve all DIDs for a controller', async () => {
            const controller = 'test-controller';
            const mockDID1 = createMockDIDDocument(undefined, controller);
            const mockDID2 = createMockDIDDocument(undefined, controller);
            
            await storageService.storeDID(mockDID1);
            await storageService.storeDID(mockDID2);
            
            const dids = await storageService.getDIDsByController(controller);
            expect(dids).toHaveLength(2);
            expect(dids.map(d => d.id)).toContain(mockDID1.id);
            expect(dids.map(d => d.id)).toContain(mockDID2.id);
        });
    });
}); 
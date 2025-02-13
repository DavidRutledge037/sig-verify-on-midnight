import { jest } from '@jest/globals';
import { DIDService } from '../../src/services/did.service.js';
import { DIDStorageService } from '../../src/services/did-storage.service.js';
import { WalletService } from '../../src/services/wallet.service.js';
import { DatabaseService } from '../../src/services/database.service.js';
import { KeyManager } from '../../src/identity/keys.js';
import { mockKeyPair } from './mock-types.js';
import { createTypedMock, createAsyncMock, createSyncMock } from './mock-utils.js';

export function createTestDIDService(): jest.Mocked<DIDService> {
    const mockWalletService = createTestWalletService();
    const service = new DIDService(mockWalletService);
    
    // Mock all methods
    service.createDID = createAsyncMock({ id: 'did:midnight:test' });
    service.verifyDID = createAsyncMock(true);
    service.resolveDID = createAsyncMock({ didDocument: { id: 'did:midnight:test' } });
    service.revokeDID = createAsyncMock(true);
    service.isValidDIDFormat = createSyncMock(true);
    
    return service as jest.Mocked<DIDService>;
}

export function createTestWalletService(): jest.Mocked<WalletService> {
    const mockKeyManager = createTestKeyManager();
    const service = new WalletService(mockKeyManager);
    
    // Mock all methods
    service.initialize = createAsyncMock(undefined);
    service.createWallet = createAsyncMock({ address: 'midnight1test' });
    service.getClient = createAsyncMock({ signAndBroadcast: jest.fn() });
    service.sign = createAsyncMock(new Uint8Array([1, 2, 3]));
    service.verify = createAsyncMock(true);
    service.getBalance = createAsyncMock('1000');
    service.signMessage = createAsyncMock(new Uint8Array([1, 2, 3]));
    service.getPublicKey = createSyncMock(new Uint8Array([1, 2, 3]));
    
    // Set required properties
    service.currentKeyPair = mockKeyPair;
    
    return service as jest.Mocked<WalletService>;
}

export function createTestKeyManager(): jest.Mocked<KeyManager> {
    const keyManager = new KeyManager();
    
    // Mock all methods
    keyManager.generateKeyPair = createAsyncMock(mockKeyPair);
    keyManager.sign = createAsyncMock(new Uint8Array([1, 2, 3]));
    keyManager.verify = createAsyncMock(true);
    keyManager.deriveAddress = createSyncMock('midnight1test');
    keyManager.getPublicKeyFromPrivate = createSyncMock(new Uint8Array([1, 2, 3]));
    keyManager.publicKeyToHex = createSyncMock('123456');
    keyManager.publicKeyFromHex = createSyncMock(new Uint8Array([1, 2, 3]));
    
    return keyManager as jest.Mocked<KeyManager>;
}

export function createTestDatabaseService(): jest.Mocked<DatabaseService> {
    const service = new DatabaseService('mongodb://localhost:27017');
    
    // Mock all methods
    service.connect = createAsyncMock(undefined);
    service.disconnect = createAsyncMock(undefined);
    service.getCollection = createSyncMock({
        insertOne: createAsyncMock({ insertedId: 'test' }),
        findOne: createAsyncMock(null),
        updateOne: createAsyncMock({ modifiedCount: 1 }),
        deleteOne: createAsyncMock({ deletedCount: 1 })
    });
    
    return service as jest.Mocked<DatabaseService>;
} 
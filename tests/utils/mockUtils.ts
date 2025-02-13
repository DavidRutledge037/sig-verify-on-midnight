import { jest } from '@jest/globals';
import type { DIDService } from '../../src/services/did.service';
import type { WalletService } from '../../src/services/wallet.service';
import type { DIDStorageService } from '../../src/services/did-storage.service';
import type { DatabaseService } from '../../src/services/database.service';

export const createMockWalletService = (): jest.Mocked<WalletService> => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  getClient: jest.fn().mockResolvedValue(null),
  getAddress: jest.fn().mockResolvedValue('test-address'),
  signMessage: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
  verify: jest.fn().mockResolvedValue(true),
  wallet: null,
  client: null,
  currentKeyPair: null,
  keyManager: {
    generateKeyPair: jest.fn().mockResolvedValue({ publicKey: new Uint8Array([1]), privateKey: new Uint8Array([2]) }),
    sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    verify: jest.fn().mockResolvedValue(true)
  }
});

export const createMockDatabaseService = (): jest.Mocked<DatabaseService> => ({
  uri: 'mongodb://localhost:27017',
  client: null,
  isConnected: jest.fn().mockReturnValue(true),
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  getCollection: jest.fn().mockReturnValue({
    insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
    findOne: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([])
    })
  })
});

export const createMockDIDStorageService = (): jest.Mocked<DIDStorageService> => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  storeDID: jest.fn().mockResolvedValue(true),
  getDIDDocument: jest.fn().mockResolvedValue(null),
  updateDID: jest.fn().mockResolvedValue(true),
  deleteDID: jest.fn().mockResolvedValue(true),
  exists: jest.fn().mockResolvedValue(false),
  getDIDsByController: jest.fn().mockResolvedValue([]),
  getDIDsByStatus: jest.fn().mockResolvedValue([])
}); 
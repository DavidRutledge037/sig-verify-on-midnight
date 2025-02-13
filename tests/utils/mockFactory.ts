import { jest } from '@jest/globals';
import type { 
  MockCollection, 
  MockMongoClient, 
  MockDatabaseService,
  MockWalletService,
  MockDIDStorageService 
} from './mockTypes';
import type { DIDDocument } from '../../src/types/services';

export const createMockCollection = <T = any>(): MockCollection<T> => ({
  insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
  findOne: jest.fn().mockResolvedValue(null),
  find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
  updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
  deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
});

export const createMockMongoClient = (): MockMongoClient => ({
  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue(createMockCollection())
  })
});

export const createMockDatabaseService = (): MockDatabaseService => ({
  uri: 'mongodb://localhost:27017',
  client: null,
  isConnected: jest.fn().mockReturnValue(true),
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  getCollection: jest.fn().mockReturnValue(createMockCollection())
});

export const createMockWalletService = (): MockWalletService => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  getClient: jest.fn().mockResolvedValue({
    signAndBroadcast: jest.fn().mockResolvedValue({ transactionHash: 'hash123' })
  }),
  getAddress: jest.fn().mockResolvedValue('test-address'),
  signMessage: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
  verify: jest.fn().mockResolvedValue(true)
});

export const createMockDIDStorageService = (): MockDIDStorageService => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  storeDID: jest.fn().mockResolvedValue(true),
  getDIDDocument: jest.fn().mockResolvedValue(null),
  updateDID: jest.fn().mockResolvedValue(true),
  deleteDID: jest.fn().mockResolvedValue(true),
  exists: jest.fn().mockResolvedValue(false)
});

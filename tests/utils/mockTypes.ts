import { jest } from '@jest/globals';
import type { Collection, MongoClient, Document } from 'mongodb';
import type { DIDDocument, WalletService, DatabaseService, DIDStorageService } from '../../src/types/services';

export interface MockCollection<T = any> extends Partial<Collection<T>> {
  insertOne: jest.Mock;
  findOne: jest.Mock;
  find: jest.Mock;
  updateOne: jest.Mock;
  deleteOne: jest.Mock;
}

export interface MockMongoClient extends Partial<MongoClient> {
  connect: jest.Mock;
  close: jest.Mock;
  db: jest.Mock;
}

export interface MockDatabaseService extends DatabaseService {
  getCollection: jest.Mock;
}

export interface MockWalletService extends WalletService {
  initialize: jest.Mock;
  getClient: jest.Mock;
  getAddress: jest.Mock;
  signMessage: jest.Mock;
  verify: jest.Mock;
}

export interface MockDIDStorageService extends DIDStorageService {
  initialize: jest.Mock;
  storeDID: jest.Mock;
  getDIDDocument: jest.Mock;
  updateDID: jest.Mock;
  deleteDID: jest.Mock;
  exists: jest.Mock;
}

export interface MockDIDService {
  createDID: jest.Mock<Promise<DIDDocument>>;
  resolveDID: jest.Mock<Promise<DIDDocument | null>>;
  verifySignature: jest.Mock<Promise<boolean>>;
}

export interface MockServices {
  keyManager: {
    generateKeyPair: jest.Mock<Promise<KeyPair>>;
    sign: jest.Mock<Promise<Uint8Array>>;
    verify: jest.Mock<Promise<boolean>>;
    getPublicKeyFromPrivate: jest.Mock<Promise<Uint8Array>>;
    publicKeyToHex: jest.Mock<string>;
    publicKeyFromHex: jest.Mock<Uint8Array>;
  };
  walletService: {
    initialize: jest.Mock<Promise<void>>;
    createWallet: jest.Mock<Promise<void>>;
    getClient: jest.Mock<Promise<any>>;
    sign: jest.Mock<Promise<Uint8Array>>;
    verify: jest.Mock<Promise<boolean>>;
    signMessage: jest.Mock<Promise<Uint8Array>>;
    getBalance: jest.Mock<Promise<string>>;
  };
} 
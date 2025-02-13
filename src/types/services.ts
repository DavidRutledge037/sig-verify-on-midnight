import { DIDDocument, DIDResolutionResult } from './did.types';
import { Collection, MongoClient, Document, Db } from 'mongodb';
import { ProofSubmission, TransactionDetails, Block } from './transaction';

export interface IDIDService {
    createDID(): Promise<DIDDocument>;
    isValidDIDFormat(did: string): boolean;
    verifyDID(did: DIDDocument): Promise<boolean>;
    addService(did: DIDDocument, type: string, endpoint: string): Promise<DIDDocument>;
}

export interface IStorageService {
    initialize(): Promise<void>;
    getDID(id: string): Promise<DIDDocument | null>;
    storeDID(did: DIDDocument): Promise<void>;
    updateDID(did: DIDDocument): Promise<boolean>;
    deleteDID(id: string): Promise<boolean>;
    getDIDsByController(controller: string): Promise<DIDDocument[]>;
    getDIDsByStatus(status: 'active' | 'revoked'): Promise<DIDDocument[]>;
    exists(id: string): Promise<boolean>;
}

export interface IMidnightService {
    submitProof(proof: ProofSubmission): Promise<string>;
    verifyProof(txHash: string): Promise<boolean>;
    getTransactionDetails(txHash: string): Promise<TransactionDetails>;
    getTx(hash: string): Promise<Uint8Array>;
    getHeight(): Promise<number>;
    getBlock(height: number): Promise<Block>;
}

export interface IWalletService {
    createWallet(): Promise<{ address: string }>;
    sign(message: string): Promise<Uint8Array>;
    verify(message: string, signature: Uint8Array): Promise<boolean>;
    getAddress(): Promise<string>;
    getPublicKey(): Uint8Array;
    isInitialized(): boolean;
}

export interface IDatabaseService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getCollection<T = any>(name: string): Promise<Collection<T>>;
    getClient(): MongoClient;
    isConnectedToDatabase(): boolean;
    getDatabaseName(): string;
}

export interface IProofService {
    submitProof(proof: any): Promise<string>;
    verifyProof(txHash: string): Promise<boolean>;
    getProof(txHash: string): Promise<any>;
}

export interface IDIDResolver {
    resolve(didId: string): Promise<DIDResolutionResult>;
    getSupportedMethods(): string[];
}

export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
}

export interface DIDDocument {
  id: string;
  controller: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
  service: Array<{
    id: string;
    type: string;
    serviceEndpoint: string;
  }>;
  created: string;
  updated: string;
}

export interface DatabaseService {
  uri: string;
  client: MongoClient | null;
  isConnected(): boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getCollection<T extends Document>(name: string): Collection<T>;
}

export interface WalletService {
  initialize(): Promise<void>;
  getClient(): Promise<any>;
  getAddress(): Promise<string>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
}

export interface DIDStorageService {
  initialize(): Promise<void>;
  storeDID(document: DIDDocument): Promise<boolean>;
  getDIDDocument(did: string): Promise<DIDDocument | null>;
  updateDID(did: string, document: DIDDocument): Promise<boolean>;
  deleteDID(did: string): Promise<boolean>;
  exists(did: string): Promise<boolean>;
}
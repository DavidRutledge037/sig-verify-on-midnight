import { DIDDocument, DIDResolutionResult } from './did.types';
import { Collection, MongoClient } from 'mongodb';
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
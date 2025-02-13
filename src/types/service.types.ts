import type { DIDDocument, DIDResolutionResult } from './did.types.js';
import type { KeyPair } from './key.types.js';

// Core interfaces for key management
export interface IKeyManager {
    generateKeyPair(): Promise<KeyPair>;
    sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
    getPublicKeyFromPrivate(privateKey: Uint8Array): Uint8Array;
    publicKeyToHex(publicKey: Uint8Array): string;
    publicKeyFromHex(hexKey: string): Uint8Array;
}

// Core interfaces for wallet operations
export interface IWalletService {
    initialize(): Promise<void>;
    createWallet(): Promise<{ address: string }>;
    sign(message: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
    getBalance(): Promise<string>;
    getPublicKey(): Uint8Array;
}

// Core interfaces for DID operations
export interface IDIDService {
    createDID(controller?: string): Promise<DIDDocument>;
    verifyDID(didDocument: DIDDocument): Promise<boolean>;
    resolveDID(didId: string): Promise<DIDResolutionResult>;
    revokeDID(didId: string): Promise<boolean>;
}

// Core interfaces for storage operations
export interface IStorageService {
    initialize(): Promise<void>;
    store<T>(collection: string, data: T): Promise<string>;
    get<T>(collection: string, id: string): Promise<T | null>;
    update<T>(collection: string, id: string, data: T): Promise<boolean>;
    delete(collection: string, id: string): Promise<boolean>;
} 
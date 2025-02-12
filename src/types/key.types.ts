import { Document } from 'mongodb';

export interface KeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
}

export interface WalletKeyManager {
    generateKeyPair(): Promise<KeyPair>;
    sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
    deriveAddress(publicKey: Uint8Array): string;
    getPublicKeyFromPrivate(privateKey: Uint8Array): Uint8Array;
    publicKeyToHex(publicKey: Uint8Array): string;
    publicKeyFromHex(hexKey: string): Uint8Array;
}

export interface WalletClient {
    signAndBroadcast(messages: any[], fee: any, memo?: string): Promise<{ transactionHash: string }>;
}

export interface WalletInterface extends Document {
    address: string;
    pubkey: Uint8Array;
    client?: WalletClient;
    currentKeyPair?: KeyPair;
}

export interface SignatureResult {
    signature: Uint8Array;
    publicKey: Uint8Array;
}

export interface VerificationResult {
    isValid: boolean;
    error?: string;
}

export interface KeyMetadata {
    created: string;
    updated?: string;
    algorithm: string;
    keyType: string;
    status: 'active' | 'revoked' | 'expired';
} 
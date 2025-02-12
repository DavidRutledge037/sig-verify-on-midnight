import { KeyManager } from '../identity/keys';
import { KeyPair, WalletKeyManager, WalletClient, WalletInterface } from '../types/key.types';
import { SigningStargateClient } from '@cosmjs/stargate';

export interface IWalletService {
    initialize(): Promise<void>;
    createWallet(): Promise<void>;
    getClient(): Promise<WalletClient>;
    getAddress(): string;
    sign(message: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
    getBalance(): Promise<string>;
    displayBalance(balance: string): string;
    getPublicKey(): Uint8Array;
    isInitialized(): boolean;
}

export class WalletService implements IWalletService {
    private keyManager: WalletKeyManager;
    private wallet: WalletInterface | null = null;
    private client: WalletClient | null = null;
    private currentKeyPair: KeyPair | null = null;

    constructor(keyManager: WalletKeyManager) {
        this.keyManager = keyManager;
    }

    isInitialized(): boolean {
        return this.wallet !== null && this.currentKeyPair !== null;
    }

    getPublicKey(): Uint8Array {
        if (!this.currentKeyPair) {
            throw new Error('Wallet not initialized');
        }
        return this.currentKeyPair.publicKey;
    }

    async initialize(): Promise<void> {
        if (!this.currentKeyPair) {
            this.currentKeyPair = await this.keyManager.generateKeyPair();
        }
        this.wallet = {
            address: this.keyManager.deriveAddress(this.currentKeyPair.publicKey),
            pubkey: this.currentKeyPair.publicKey
        };
    }

    async createWallet(): Promise<void> {
        await this.initialize();
    }

    async getClient(): Promise<WalletClient> {
        if (!this.client) {
            throw new Error('Wallet client not initialized');
        }
        return this.client;
    }

    getAddress(): string {
        if (!this.wallet) {
            throw new Error('Wallet not initialized');
        }
        return this.wallet.address;
    }

    async sign(message: Uint8Array): Promise<Uint8Array> {
        if (!this.currentKeyPair) {
            throw new Error('Wallet not initialized');
        }
        return this.keyManager.sign(message, this.currentKeyPair.privateKey);
    }

    async verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
        return this.keyManager.verify(message, signature, publicKey);
    }

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        return this.sign(message);
    }

    async getBalance(): Promise<string> {
        if (!this.wallet) {
            throw new Error('Wallet not initialized');
        }
        return '0'; // Implement actual balance check
    }

    displayBalance(balance: string): string {
        return `${balance} NIGHT`;
    }
} 
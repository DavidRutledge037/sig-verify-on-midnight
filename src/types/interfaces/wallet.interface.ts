import { KeyPair } from '../key.types';
import { IService } from './service.interface';

export interface IWallet {
    address: string;
    publicKey: Uint8Array;
}

export interface IWalletClient {
    signAndBroadcast(messages: any[], fee: any, memo?: string): Promise<{ transactionHash: string }>;
}

export interface IWalletService extends IService {
    createWallet(): Promise<void>;
    getClient(): Promise<IWalletClient>;
    getAddress(): string;
    sign(message: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
    signMessage(message: string): Promise<Uint8Array>;
    getBalance(): Promise<string>;
    displayBalance(): string;
    getPublicKey(): Uint8Array;
    getCurrentKeyPair(): KeyPair | undefined;
} 
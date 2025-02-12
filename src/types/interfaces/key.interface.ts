import { KeyPair } from '../key.types';

export interface IKeyManager {
    generateKeyPair(): Promise<KeyPair>;
    sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
    deriveAddress(publicKey: Uint8Array): string;
    getPublicKeyFromPrivate(privateKey: Uint8Array): Uint8Array;
    publicKeyToHex(publicKey: Uint8Array): string;
    publicKeyFromHex(hexKey: string): Uint8Array;
} 
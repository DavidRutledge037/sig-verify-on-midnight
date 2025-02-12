import { KeyPair, WalletKeyManager } from '../types/key.types';
import { Ed25519, Sha256 } from '@cosmjs/crypto';
import { toBase64 } from '@cosmjs/encoding';

export class KeyManager implements WalletKeyManager {
    async generateKeyPair(): Promise<KeyPair> {
        const seed = crypto.getRandomValues(new Uint8Array(32));
        const privKey = await Ed25519.makeKeypair(seed);
        const pubKey = await Ed25519.makeKeypair(seed);
        return {
            publicKey: pubKey.pubkey,
            privateKey: privKey.privkey
        };
    }

    async sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
        const keypair = await Ed25519.makeKeypair(privateKey);
        return Ed25519.signSync(message, keypair.privkey);
    }

    async verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
        try {
            return Ed25519.verifySync(signature, message, publicKey);
        } catch (error) {
            return false;
        }
    }

    deriveAddress(publicKey: Uint8Array): string {
        const hasher = new Sha256();
        hasher.update(publicKey);
        const hash = hasher.digest();
        const addressBytes = hash.slice(0, 20);
        return `midnight1${toBase64(addressBytes)}`;
    }

    getPublicKeyFromPrivate(privateKey: Uint8Array): Uint8Array {
        const keypair = Ed25519.makeKeypairSync(privateKey);
        return keypair.pubkey;
    }

    publicKeyToHex(publicKey: Uint8Array): string {
        return Buffer.from(publicKey).toString('hex');
    }

    publicKeyFromHex(hexKey: string): Uint8Array {
        return new Uint8Array(Buffer.from(hexKey, 'hex'));
    }
}

export { type KeyPair }; 
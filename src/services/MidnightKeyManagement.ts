import { CryptoService } from './CryptoService';
import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { hmac } from '@noble/hashes/hmac';
import { sha512 } from '@noble/hashes/sha512';
import { bytesToHex, hexToBytes, concatBytes } from '@noble/hashes/utils';
import { CryptoServiceError } from '../errors/CryptoServiceErrors';

export interface MidnightKeyPath {
    purpose: number;     // e.g., 44' for BIP44
    coinType: number;    // Midnight's coin type
    account: number;     // Account index
    change: number;      // External or internal chain
    index: number;       // Address index
}

export class MidnightKeyManagement {
    private readonly MIDNIGHT_COIN_TYPE = 7777;
    private readonly HARDENED_OFFSET = 0x80000000;

    constructor(private cryptoService: CryptoService) {}

    async deriveKeyPair(
        seed: string, 
        path: MidnightKeyPath = this.getDefaultKeyPath()
    ): Promise<{ publicKey: string; privateKey: string }> {
        try {
            const seedBytes = hexToBytes(seed);
            let key = this.deriveMasterKey(seedBytes);
            
            // Derive through path: m/44'/7777'/account'/change/index
            key = this.deriveKey(key, this.HARDENED_OFFSET + 44);
            key = this.deriveKey(key, this.HARDENED_OFFSET + this.MIDNIGHT_COIN_TYPE);
            key = this.deriveKey(key, this.HARDENED_OFFSET + path.account);
            key = this.deriveKey(key, path.change);
            key = this.deriveKey(key, path.index);

            const privateKeyHex = bytesToHex(key.privateKey);
            const publicKey = secp256k1.getPublicKey(key.privateKey, false);
            const publicKeyHex = bytesToHex(publicKey);

            return { privateKey: privateKeyHex, publicKey: publicKeyHex };
        } catch (error) {
            throw new CryptoServiceError(`Key derivation failed: ${(error as Error).message}`);
        }
    }

    async generateMidnightSeed(): Promise<string> {
        const entropy = new Uint8Array(32);
        crypto.getRandomValues(entropy);
        return bytesToHex(entropy);
    }

    getDefaultKeyPath(): MidnightKeyPath {
        return {
            purpose: 44,
            coinType: this.MIDNIGHT_COIN_TYPE,
            account: 0,
            change: 0,
            index: 0
        };
    }

    private deriveMasterKey(seed: Uint8Array): { privateKey: Uint8Array; chainCode: Uint8Array } {
        const hmacResult = hmac(sha512, new TextEncoder().encode('Bitcoin seed'), seed);
        return {
            privateKey: hmacResult.slice(0, 32),
            chainCode: hmacResult.slice(32)
        };
    }

    private deriveKey(
        parent: { privateKey: Uint8Array; chainCode: Uint8Array },
        index: number
    ): { privateKey: Uint8Array; chainCode: Uint8Array } {
        let data: Uint8Array;
        
        if (index >= this.HARDENED_OFFSET) {
            // Hardened derivation
            const indexBuffer = new Uint8Array(4);
            new DataView(indexBuffer.buffer).setUint32(0, index, false);
            data = concatBytes(new Uint8Array([0]), parent.privateKey, indexBuffer);
        } else {
            // Normal derivation
            const pubKey = secp256k1.getPublicKey(parent.privateKey, true);
            const indexBuffer = new Uint8Array(4);
            new DataView(indexBuffer.buffer).setUint32(0, index, false);
            data = concatBytes(pubKey, indexBuffer);
        }
        
        const I = hmac(sha512, parent.chainCode, data);
        const IL = I.slice(0, 32);
        const IR = I.slice(32);
        
        // Calculate child private key
        const n = secp256k1.CURVE.n;
        const parentNum = BigInt('0x' + bytesToHex(parent.privateKey));
        const childNum = BigInt('0x' + bytesToHex(IL));
        const derivedNum = (parentNum + childNum) % n;
        
        const childKeyHex = derivedNum.toString(16).padStart(64, '0');
        const childKeyBytes = hexToBytes(childKeyHex);
        
        if (!secp256k1.utils.isValidPrivateKey(childKeyBytes)) {
            // If invalid, increment index and try again
            return this.deriveKey(parent, index + 1);
        }
        
        return {
            privateKey: childKeyBytes,
            chainCode: IR
        };
    }
} 
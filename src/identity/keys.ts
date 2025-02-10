import { randomBytes } from 'crypto';
import * as ed from '@noble/ed25519';
import { base58btc } from 'multiformats/bases/base58';
import { sha512 } from '@noble/hashes/sha512';

// Set up SHA-512 for ed25519
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

interface KeyPair {
    publicKey: string;
    privateKey: string;
}

class KeyManager {
    /**
     * Generate an Ed25519 key pair and encode the public key in multibase format
     */
    async generateKeyPair(): Promise<KeyPair> {
        // Generate private key
        const privateKey = ed.utils.randomPrivateKey();
        
        // Derive public key
        const publicKey = await ed.getPublicKey(privateKey);
        
        // Encode keys in multibase format (base58btc for Midnight)
        return {
            publicKey: 'z' + base58btc.encode(publicKey),
            privateKey: base58btc.encode(privateKey)
        };
    }

    /**
     * Sign a message using the private key
     */
    async sign(message: Uint8Array, privateKey: string): Promise<string> {
        // Decode the private key from base58
        const keyBytes = base58btc.decode(privateKey);
        
        // Sign the message
        const signature = await ed.sign(message, keyBytes);
        
        // Return base58-encoded signature
        return base58btc.encode(signature);
    }

    /**
     * Verify a signature using the public key
     */
    async verify(
        message: Uint8Array,
        signature: string,
        publicKey: string
    ): Promise<boolean> {
        try {
            // Remove the multibase prefix ('z') and decode
            const pubKeyBytes = base58btc.decode(publicKey.slice(1));
            const sigBytes = base58btc.decode(signature);
            
            // Verify the signature
            return await ed.verify(sigBytes, message, pubKeyBytes);
        } catch (error) {
            return false;
        }
    }
}

export { KeyManager, type KeyPair }; 
import { sha256 } from '@noble/hashes/sha256';
import { base58btc } from 'multiformats/bases/base58';

class HashingService {
    /**
     * Creates a Midnight-compatible hash of data
     * @param data The data to hash
     * @returns A base58btc encoded hash with 'z' prefix
     */
    static hashData(data: Uint8Array | string): string {
        // Convert string to Uint8Array if needed
        const bytes = typeof data === 'string' 
            ? new TextEncoder().encode(data)
            : data;

        // Generate SHA-256 hash
        const hash = sha256(bytes);

        // Encode in base58btc with 'z' prefix (multibase format)
        return 'z' + base58btc.encode(hash);
    }

    /**
     * Verifies if a hash matches the given data
     */
    static verifyHash(data: Uint8Array | string, hash: string): boolean {
        try {
            const computedHash = this.hashData(data);
            return computedHash === hash;
        } catch {
            return false;
        }
    }
}

export { HashingService }; 
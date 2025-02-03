declare module 'crypto-browserify' {
    import { BinaryLike } from 'crypto';
    
    interface Hash {
        update(data: BinaryLike): Hash;
        digest(encoding: 'hex'): string;
    }

    interface Subtle {
        digest(algorithm: string, data: Uint8Array): Promise<ArrayBuffer>;
    }

    export function createHash(algorithm: string): Hash;
    export function randomBytes(size: number): Buffer;
    export const subtle: Subtle;

    const crypto: {
        createHash: typeof createHash;
        randomBytes: typeof randomBytes;
        subtle: Subtle;
    };

    export default crypto;
} 
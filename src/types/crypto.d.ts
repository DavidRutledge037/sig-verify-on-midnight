import { Cipher, Decipher } from 'crypto';

declare module 'crypto' {
    interface Cipher {
        getAuthTag(): Buffer;
    }

    interface Decipher {
        setAuthTag(tag: Buffer): void;
    }
} 
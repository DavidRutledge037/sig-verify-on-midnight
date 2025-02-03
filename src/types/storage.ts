export interface StorageConfig {
    encryption: 'AES' | 'ChaCha20';
    compression?: boolean;
    redundancy?: number;
}

export interface StorageProvider {
    type: 'IPFS' | 'Arweave' | 'Local';
    endpoint: string;
    apiKey?: string;
}

export interface StorageMetadata {
    cid: string;
    size: number;
    encryptionKey?: string;
    storageProvider: StorageProvider;
} 
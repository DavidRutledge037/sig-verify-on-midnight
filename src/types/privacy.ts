export type PrivacyLevel = 'public' | 'private' | 'shielded';

export interface PrivacyConfig {
    level: PrivacyLevel;
    encryptionKey?: string;
}

export interface PrivacyOptions {
    level?: PrivacyLevel;
    encryptionKey?: string;
    zkProof?: boolean;
}

export interface ShieldedTransaction {
    txHash: string;
    proof: string;
    commitment: string;
    nullifier: string;
} 